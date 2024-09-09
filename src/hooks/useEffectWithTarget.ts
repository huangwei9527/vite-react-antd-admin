import { useEffect } from 'react'
import createEffectWithTarget from '@/utils/createEffectWithTarget'

const useEffectWithTarget = createEffectWithTarget(useEffect)

export default useEffectWithTarget
