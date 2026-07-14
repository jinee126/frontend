import { useEffect, useMemo, useState } from 'react'
import { useAllRolePermissions, useUpdateRolePermissions } from '@/hooks/use-menus'
import type { ActionDetail, MenuCategoryGroup, RolePermissionsByRole } from '@/types/menu'
import styles from './menu-management-page.module.scss'

/** 트리 전체를 순회해 granted=true 인 permissionId 집합을 모은다. */
function collectGrantedIds(permissions: RolePermissionsByRole): Set<number> {
  const granted = new Set<number>()
  const add = (actions: ActionDetail[]) => {
    for (const action of actions) {
      if (action.granted) granted.add(action.permissionId)
    }
  }
  for (const category of permissions.menus) {
    for (const sub of category.subMenus) {
      add(sub.actions)
      for (const leaf of sub.leafMenus) add(leaf.actions)
    }
  }
  return granted
}

/** 두 집합이 동일한 원소를 갖는지 비교. */
function sameSet(a: Set<number>, b: Set<number>): boolean {
  if (a.size !== b.size) return false
  for (const value of a) if (!b.has(value)) return false
  return true
}

/** 액션 권한 목록 (편집 가능). draft 의 체크 상태를 토글한다. */
function ActionList({
  actions,
  draft,
  onToggle,
}: {
  actions: ActionDetail[]
  draft: Set<number>
  onToggle: (permissionId: number, checked: boolean) => void
}) {
  if (actions.length === 0) {
    return <span className={styles.empty}>정의된 권한이 없습니다.</span>
  }

  return (
    <div className={styles.actions}>
      {actions.map((action) => {
        const checked = draft.has(action.permissionId)
        return (
          <label
            key={action.permissionId}
            className={`${styles.action} ${checked ? styles.actionGranted : ''}`}
            title={action.description}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onToggle(action.permissionId, e.target.checked)}
            />
            <span className={styles.badge}>{action.action}</span>
            <span className={styles.desc}>{action.description || action.permissionKey}</span>
          </label>
        )
      })}
    </div>
  )
}

/** 카테고리(root) → 서브메뉴 → 리프메뉴 트리를 렌더링한다. */
function CategoryTree({
  category,
  draft,
  onToggle,
}: {
  category: MenuCategoryGroup
  draft: Set<number>
  onToggle: (permissionId: number, checked: boolean) => void
}) {
  return (
    <section className={styles.category}>
      <div className={styles.categoryTitle}>
        {category.menuName}
        <span className={styles.key}>{category.menuKey}</span>
      </div>

      {category.subMenus.length === 0 ? (
        <div className={styles.subMenu}>
          <span className={styles.empty}>하위 메뉴가 없습니다.</span>
        </div>
      ) : (
        category.subMenus.map((sub) => (
          <div key={sub.subMenuId} className={styles.subMenu}>
            <div className={styles.subMenuHead}>
              <span className={styles.name}>{sub.subMenuName}</span>
              {sub.path && <span className={styles.path}>{sub.path}</span>}
            </div>

            {sub.leafMenus.length > 0 ? (
              // Case A: 3-depth — 액션은 리프메뉴에 매핑
              sub.leafMenus.map((leaf) => (
                <div key={leaf.leafMenuId} className={styles.leaf}>
                  <div className={styles.name}>
                    {leaf.leafMenuName}
                    {leaf.path && <span className={styles.path}> {leaf.path}</span>}
                  </div>
                  <ActionList actions={leaf.actions} draft={draft} onToggle={onToggle} />
                </div>
              ))
            ) : (
              // Case B: 2-depth — 본인이 leaf, 액션이 서브메뉴에 매핑
              <ActionList actions={sub.actions} draft={draft} onToggle={onToggle} />
            )}
          </div>
        ))
      )}
    </section>
  )
}

export default function MenuManagementPage() {
  const { data, isLoading, isError, error } = useAllRolePermissions()
  const updateMutation = useUpdateRolePermissions()
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

  // 선택된 Role (없으면 첫 번째 Role 을 기본 선택)
  const selected = useMemo<RolePermissionsByRole | undefined>(() => {
    if (!data || data.length === 0) return undefined
    return data.find((item) => item.role.id === selectedRoleId) ?? data[0]
  }, [data, selectedRoleId])

  // 서버 기준 granted 집합. selected 가 바뀔 때(선택 변경/저장 후 refetch)마다 재계산된다.
  const serverGranted = useMemo(
    () => (selected ? collectGrantedIds(selected) : new Set<number>()),
    [selected],
  )

  // 편집 중인 초안(draft). 서버 상태가 바뀌면 초기화한다.
  const [draft, setDraft] = useState<Set<number>>(new Set())
  useEffect(() => {
    setDraft(new Set(serverGranted))
  }, [serverGranted])

  const dirty = !sameSet(draft, serverGranted)

  const handleToggle = (permissionId: number, checked: boolean) => {
    setDraft((prev) => {
      const next = new Set(prev)
      if (checked) next.add(permissionId)
      else next.delete(permissionId)
      return next
    })
  }

  const handleReset = () => setDraft(new Set(serverGranted))

  const handleSave = () => {
    if (!selected) return
    updateMutation.mutate({
      roleId: selected.role.id,
      grantedPermissionIds: [...draft],
    })
  }

  if (isLoading) {
    return <div className={styles.state}>메뉴 권한을 불러오는 중...</div>
  }

  if (isError) {
    return (
      <div className={styles.state}>
        메뉴 권한을 불러오지 못했습니다.
        {error instanceof Error && <div>{error.message}</div>}
      </div>
    )
  }

  if (!data || data.length === 0 || !selected) {
    return <div className={styles.state}>등록된 Role 이 없습니다.</div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>메뉴 관리</h1>
        <p>Role 별로 메뉴 트리를 확인하고, 부여할 액션 권한을 체크한 뒤 저장합니다.</p>
      </div>

      <div className={styles.roleTabs}>
        {data.map((item) => {
          const active = item.role.id === selected.role.id
          return (
            <button
              key={item.role.id}
              type="button"
              className={`${styles.roleTab} ${active ? styles.roleTabActive : ''}`}
              onClick={() => setSelectedRoleId(item.role.id)}
            >
              {item.role.roleName}
              <span className={styles.count}>{item.role.userCount}명</span>
            </button>
          )
        })}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarInfo}>
          <strong>{selected.role.roleName}</strong>
          {selected.role.description && <span> · {selected.role.description}</span>}
          {dirty && <span className={styles.dirtyMark}>변경사항 있음</span>}
        </div>
        <div className={styles.toolbarActions}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
            disabled={!dirty || updateMutation.isPending}
          >
            되돌리기
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!dirty || updateMutation.isPending}
          >
            {updateMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      {updateMutation.isError && (
        <div className={styles.errorBar}>
          저장에 실패했습니다.
          {updateMutation.error instanceof Error && ` (${updateMutation.error.message})`}
        </div>
      )}

      {selected.menus.length === 0 ? (
        <div className={styles.state}>표시할 메뉴가 없습니다.</div>
      ) : (
        selected.menus.map((category) => (
          <CategoryTree
            key={category.menuId}
            category={category}
            draft={draft}
            onToggle={handleToggle}
          />
        ))
      )}
    </div>
  )
}
