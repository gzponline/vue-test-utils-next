import { getCurrentInstance } from 'vue'

export const createDataMixin = (data: Record<string, unknown>) => {
  return {
    created() {
      for (const [k, v] of Object.entries(data)) {
        // why not change drictly
        getCurrentInstance()!.data = { ...getCurrentInstance()!.data, [k]: v }
      }
    }
  }
}
