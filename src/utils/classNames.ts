import classNames from 'classnames';

export function resolveClasses(styles : Record<string, string>, base : string, extra = ''){
    return classNames(
        styles[base],
        ...extra.split(' ').map((cls) => styles[cls]).filter(Boolean),
    )

}