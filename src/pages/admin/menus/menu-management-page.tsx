import { useMemo, useState } from 'react'
import { useMenuMutations, useMenuTree } from '@/hooks/use-menus'
import type { CreateMenuRequest, MenuNode, UpdateMenuRequest } from '@/types/menu'
import styles from './menu-management-page.module.scss'

/** 트리를 depth 정보와 함께 평탄화한다. (렌더링/부모선택용) */
function flatten(nodes: MenuNode[], depth = 0): { node: MenuNode; depth: number }[] {
  return nodes.flatMap((node) => [
    { node, depth },
    ...flatten(node.children, depth + 1),
  ])
}

/** 특정 노드와 그 하위 노드 id 집합. (부모 선택 시 자기 자신/후손 제외용) */
function collectSubtreeIds(node: MenuNode): Set<number> {
  const ids = new Set<number>([node.id])
  for (const child of node.children) {
    for (const id of collectSubtreeIds(child)) ids.add(id)
  }
  return ids
}

type FormState =
  | { mode: 'create'; parentId: number | null }
  | { mode: 'edit'; target: MenuNode }
  | null

const EMPTY_CREATE: CreateMenuRequest = {
  menuKey: '',
  menuName: '',
  path: '',
  parentId: null,
  displayOrder: 0,
}

export default function MenuManagementPage() {
  const { data: tree, isLoading, isError, error } = useMenuTree()
  const { create, update, remove } = useMenuMutations()
  const [form, setForm] = useState<FormState>(null)

  // 폼 필드 상태 (create/edit 공용)
  const [fields, setFields] = useState<CreateMenuRequest & { active: boolean }>({
    ...EMPTY_CREATE,
    active: true,
  })

  const flat = useMemo(() => (tree ? flatten(tree) : []), [tree])

  const pending = create.isPending || update.isPending || remove.isPending
  const mutationError = create.error || update.error || remove.error

  const openCreate = (parentId: number | null) => {
    setFields({ ...EMPTY_CREATE, parentId })
    setForm({ mode: 'create', parentId })
  }

  const openEdit = (node: MenuNode) => {
    setFields({
      menuKey: node.menuKey,
      menuName: node.menuName,
      path: node.path ?? '',
      parentId: node.parentId,
      displayOrder: node.displayOrder,
      active: node.active,
    })
    setForm({ mode: 'edit', target: node })
  }

  const closeForm = () => setForm(null)

  const handleSubmit = () => {
    if (!form) return
    if (form.mode === 'create') {
      const request: CreateMenuRequest = {
        menuKey: fields.menuKey.trim(),
        menuName: fields.menuName.trim(),
        path: fields.path?.trim() || null,
        parentId: fields.parentId,
        displayOrder: fields.displayOrder,
      }
      create.mutate(request, { onSuccess: closeForm })
    } else {
      const request: UpdateMenuRequest = {
        menuName: fields.menuName.trim(),
        path: fields.path?.trim() || null,
        parentId: fields.parentId,
        displayOrder: fields.displayOrder,
        active: fields.active,
      }
      update.mutate({ id: form.target.id, request }, { onSuccess: closeForm })
    }
  }

  const handleDelete = (node: MenuNode) => {
    if (!window.confirm(`'${node.menuName}' 메뉴를 삭제할까요? (연결된 권한도 함께 삭제됩니다)`)) {
      return
    }
    remove.mutate(node.id)
  }

  // 부모 선택 옵션: 수정 시 자기 자신/후손은 제외
  const parentOptions = useMemo(() => {
    const excluded =
      form?.mode === 'edit' ? collectSubtreeIds(form.target) : new Set<number>()
    return flat.filter(({ node }) => !excluded.has(node.id))
  }, [flat, form])

  const canSubmit =
    fields.menuName.trim().length > 0 &&
    (form?.mode === 'edit' || fields.menuKey.trim().length > 0)

  if (isLoading) {
    return <div className={styles.state}>메뉴를 불러오는 중...</div>
  }

  if (isError) {
    return (
      <div className={styles.state}>
        메뉴를 불러오지 못했습니다.
        {error instanceof Error && <div>{error.message}</div>}
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>메뉴 관리</h1>
        <p>메뉴 구성(계층·경로·표시순서)을 관리합니다. 메뉴 생성 시 5종 권한이 자동으로 만들어집니다.</p>
      </div>

      <div className={styles.toolbar}>
        <button type="button" className={styles.primaryButton} onClick={() => openCreate(null)}>
          + 최상위 메뉴 추가
        </button>
      </div>

      {mutationError && (
        <div className={styles.errorBar}>
          작업에 실패했습니다.
          {mutationError instanceof Error && ` (${mutationError.message})`}
        </div>
      )}

      <div className={styles.layout}>
        {/* 메뉴 트리 */}
        <div className={styles.treePanel}>
          {flat.length === 0 ? (
            <div className={styles.empty}>등록된 메뉴가 없습니다.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>메뉴</th>
                  <th>키</th>
                  <th>경로</th>
                  <th className={styles.center}>순서</th>
                  <th className={styles.center}>활성</th>
                  <th className={styles.center}>작업</th>
                </tr>
              </thead>
              <tbody>
                {flat.map(({ node, depth }) => (
                  <tr key={node.id} className={node.active ? '' : styles.inactiveRow}>
                    <td>
                      <span style={{ paddingLeft: `${depth * 20}px` }}>
                        {depth > 0 && <span className={styles.treeMark}>└ </span>}
                        {node.menuName}
                      </span>
                    </td>
                    <td className={styles.mono}>{node.menuKey}</td>
                    <td className={styles.mono}>{node.path || '-'}</td>
                    <td className={styles.center}>{node.displayOrder}</td>
                    <td className={styles.center}>
                      {node.active ? (
                        <span className={styles.badgeOn}>활성</span>
                      ) : (
                        <span className={styles.badgeOff}>비활성</span>
                      )}
                    </td>
                    <td className={styles.center}>
                      <div className={styles.rowActions}>
                        <button type="button" onClick={() => openCreate(node.id)} disabled={pending}>
                          하위추가
                        </button>
                        <button type="button" onClick={() => openEdit(node)} disabled={pending}>
                          수정
                        </button>
                        <button
                          type="button"
                          className={styles.danger}
                          onClick={() => handleDelete(node)}
                          disabled={pending}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 생성/수정 폼 */}
        {form && (
          <div className={styles.formPanel}>
            <h2>{form.mode === 'create' ? '메뉴 추가' : '메뉴 수정'}</h2>

            <label className={styles.field}>
              <span>메뉴 키 {form.mode === 'create' && <em>*</em>}</span>
              <input
                type="text"
                value={fields.menuKey}
                placeholder="예: USER_MGMT"
                disabled={form.mode === 'edit'}
                onChange={(e) => setFields((f) => ({ ...f, menuKey: e.target.value }))}
              />
              {form.mode === 'edit' && <small>메뉴 키는 권한 키 접두어라 변경할 수 없습니다.</small>}
            </label>

            <label className={styles.field}>
              <span>메뉴 이름 <em>*</em></span>
              <input
                type="text"
                value={fields.menuName}
                placeholder="예: 사용자관리"
                onChange={(e) => setFields((f) => ({ ...f, menuName: e.target.value }))}
              />
            </label>

            <label className={styles.field}>
              <span>경로(path)</span>
              <input
                type="text"
                value={fields.path ?? ''}
                placeholder="예: /users"
                onChange={(e) => setFields((f) => ({ ...f, path: e.target.value }))}
              />
            </label>

            <label className={styles.field}>
              <span>상위 메뉴</span>
              <select
                value={fields.parentId ?? ''}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    parentId: e.target.value === '' ? null : Number(e.target.value),
                  }))
                }
              >
                <option value="">(최상위)</option>
                {parentOptions.map(({ node, depth }) => (
                  <option key={node.id} value={node.id}>
                    {' '.repeat(depth * 2)}
                    {node.menuName}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>표시 순서</span>
              <input
                type="number"
                value={fields.displayOrder}
                onChange={(e) =>
                  setFields((f) => ({ ...f, displayOrder: Number(e.target.value) || 0 }))
                }
              />
            </label>

            {form.mode === 'edit' && (
              <label className={styles.checkField}>
                <input
                  type="checkbox"
                  checked={fields.active}
                  onChange={(e) => setFields((f) => ({ ...f, active: e.target.checked }))}
                />
                <span>활성화</span>
              </label>
            )}

            <div className={styles.formActions}>
              <button type="button" className={styles.secondaryButton} onClick={closeForm}>
                취소
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleSubmit}
                disabled={!canSubmit || pending}
              >
                {pending ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
