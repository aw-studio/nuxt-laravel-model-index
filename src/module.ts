import { defineNuxtModule, createResolver, addImportsDir } from '@nuxt/kit'
import { defu } from 'defu'

const MODULE_NAME = 'nuxt-laravel-model-index'

export interface ModuleOptions {
  baseUrl: string
}

const defaultModuleOptions: ModuleOptions = {
  baseUrl: 'http://localhost:8000',
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: MODULE_NAME,
    configKey: 'modelIndex',
  },
  defaults: defaultModuleOptions,
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    _nuxt.options.runtimeConfig.public.modelIndex = defu(
      _nuxt.options.runtimeConfig.public.modelIndex as ModuleOptions,
      _options
    )

    addImportsDir(resolver.resolve('./runtime/composables'))
  },
})
