import * as React from 'react'
import { Box3, Group, Sphere, Vector3 } from 'three'

type Props = JSX.IntrinsicElements['group'] & {
    alignTop?: boolean
}

export const VerticalCenter = React.forwardRef<Group, Props>(function Center({ children, alignTop, ...props }, ref) {
    const outer = React.useRef<Group>(null)
    const inner = React.useRef<Group>(null)

    React.useLayoutEffect(() => {
        // @ts-ignore
        if (!outer.current || !inner.current) return

        outer.current.position.set(0, 0, 0)
        outer.current.updateWorldMatrix(true, true)
        const box3 = new Box3().setFromObject(inner.current)
        const center = new Vector3()
        const sphere = new Sphere()
        const height = box3.max.y - box3.min.y
        box3.getCenter(center)
        box3.getBoundingSphere(sphere)
        outer.current.position.set(0, -center.y + (alignTop ? height / 2 : 0), 0)
    }, [alignTop, children])

    return (
        <group ref={ref} {...props}>
            <group ref={outer}>
                <group ref={inner}>{children}</group>
            </group>
        </group>
    )
})
