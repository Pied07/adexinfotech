import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'
import '@payloadcms/next/css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const serverFunction = async (args: Parameters<typeof handleServerFunctions>[0] extends infer T ? Omit<T, 'config' | 'importMap'> : never) => {
    'use server'
    return handleServerFunctions({ ...args, config, importMap })
  }
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>
}
