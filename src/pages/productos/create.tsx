import React from 'react'
import Layout from "@/components/Layout/Layout"
import FormCreate from '@/components/Products/Form'

export default function CreateProductos() {
  return (
    <Layout
      title="Productos"
    >
      <FormCreate />
    </Layout>
  )
}
