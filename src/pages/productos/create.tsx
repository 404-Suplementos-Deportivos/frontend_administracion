import { useState, useEffect } from "react"
import { message } from "antd"
import Layout from "@/components/Layout/Layout"
import FormCreate from '@/components/Products/Form'
import { getCategories, getSubCategories } from '@/services/productsService'
import { Categoria } from "@/interfaces/Categoria"
import { Subategoria } from "@/interfaces/SubCategoria"

interface CreateProductosState {
  categories: Categoria[]
  subCategories: Subategoria[]
  selectedCategory: number
}

export default function CreateProductos() {
  const [categories, setCategories] = useState<CreateProductosState['categories']>([])
  const [subCategories, setSubCategories] = useState<CreateProductosState['subCategories']>([])
  const [selectedCategory, setSelectedCategory] = useState<CreateProductosState['selectedCategory']>(0)
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getCategoriesData = async () => {
      try {
        const dataCategories = await getCategories()
        if(dataCategories[0]?.id) {
          const dataSubCategories = await getSubCategories(dataCategories[0].id)
          setCategories(dataCategories)
          setSubCategories(dataSubCategories)
        }
      } catch (error: any) {
        messageApi.open({
          content: 'Error al obtener datos',
          duration: 2,
          type: 'error'
        })
      }
    }
    getCategoriesData()
  }, [])

  useEffect(() => {
    const getSubCategoriesData = async () => {
      try {
        const dataSubCategories = await getSubCategories(selectedCategory)
        setSubCategories(dataSubCategories)
      } catch (error: any) {
        messageApi.open({
          content: 'Error al obtener datos',
          duration: 2,
          type: 'error'
        })
      }
    }
    getSubCategoriesData()
  }, [selectedCategory])

  return (
    <Layout
      title="Productos"
    >
      {contextHolder}
      <h2 style={{marginTop: 0}}>Crear un Nuevo Producto</h2>
      <FormCreate 
        categorias={categories}
        subCategorias={subCategories}
        setSelectedCategory={setSelectedCategory}
      />
    </Layout>
  )
}
