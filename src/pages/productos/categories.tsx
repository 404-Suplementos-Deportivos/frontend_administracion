import { useState, useEffect, Key } from "react"
import Link from "next/link"
import { message, Button, Table, TableProps, Popconfirm  } from "antd"
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import Layout from "@/components/Layout/Layout"
import CategoriasModal from "@/components/Products/CategoriasModal";
import SubcategoriasModal from "@/components/Products/SubcategoriasModal";
import ListadoCategoriasFilter from "@/components/Filters/ListadoCategoriasFilter";
import { getCategories, deleteCategory, getSubCategories, deleteSubCategory } from "@/services/productsService"
import { Categoria } from "@/interfaces/Categoria";
import { SubCategoria } from "@/interfaces/SubCategoria";

interface CategoriesState {
  categories: Categoria[];
  categoriasFiltered: Categoria[];
  categoryEdit: Categoria | null;
  subcategories: SubCategoria[];
  filteredInfo: Record<string, FilterValue | null>;
  sortedInfo: SorterResult<Categoria>
  lastExpandedRowId: number | null | undefined,
  isModalOpen: boolean;
  isModalSubcategoriesOpen: boolean;
  idCategory: number;
  subcategoryEdit: SubCategoria | null;
  actualCategory: number | null;
}

export default function Categories() {
  const [messageApi, contextHolder] = message.useMessage();
  const [categories, setCategories] = useState<CategoriesState['categories']>();
  const [categoriasFiltered, setCategoriasFiltered] = useState<CategoriesState['categoriasFiltered']>([]);
  const [categoryEdit, setCategoryEdit] = useState<CategoriesState['categoryEdit']>(null);
  const [subcategories, setSubcategories] = useState<CategoriesState['subcategories']>();
  const [filteredInfo, setFilteredInfo] = useState<CategoriesState['filteredInfo']>({});
  const [sortedInfo, setSortedInfo] = useState<CategoriesState['sortedInfo']>({});
  const [lastExpandedRowId, setLastExpandedRowId] = useState<CategoriesState['lastExpandedRowId']>(null);
  const [isModalOpen, setIsModalOpen] = useState<CategoriesState['isModalOpen']>(false);
  const [isModalSubcategoriesOpen, setIsModalSubcategoriesOpen] = useState<CategoriesState['isModalSubcategoriesOpen']>(false);
  const [idCategory, setIdCategory] = useState<CategoriesState['idCategory']>(0);
  const [subcategoryEdit, setSubcategoryEdit] = useState<CategoriesState['subcategoryEdit']>(null);
  const [actualCategory, setActualCategory] = useState<CategoriesState['actualCategory']>(null);

  useEffect(() => {
    fetchCategories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchCategories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen])

  useEffect(() => {
    fetchSubcategories(idCategory)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalSubcategoriesOpen])

  const fetchCategories = async () => {
    try {
      const responseCategories = await getCategories()
      setCategories(responseCategories)
    } catch (error: any) {
      messageApi.open({
        content: 'Error al obtener datos',
        duration: 2,
        type: 'error'
      })
    }
  }

  const fetchSubcategories = async (id: number) => {
    setActualCategory(id)
    try {
      const responseSubcategories = await getSubCategories(id)
      setSubcategories(responseSubcategories)
    } catch (error: any) {
      messageApi.open({
        content: 'Error al obtener datos',
        duration: 2,
        type: 'error'
      })
    }
  }

  const handleChange: TableProps<Categoria>['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Categoria>);
  };

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const confirmEditCategory = async (categoria: Categoria) => {
    setCategoryEdit(categoria);
    setIsModalOpen(true);
  };

  const confirmDeleteCategory = async (id: number) => {
    try {
      const response = await deleteCategory(id)
      message.success({ content: response.message, key: 'deleteCategory', duration: 3 });
      fetchCategories()
    } catch (error: any) {
      message.error({ content: error.response.data.message , key: 'deleteCategory', duration: 3 });
    }
  };

  const confirmCreateSubcategory = async (id: number) => {
    setIdCategory(id);
    setIsModalSubcategoriesOpen(true);
  };

  const confirmEditSubcategory = async (subcategoria: SubCategoria) => {
    setSubcategoryEdit(subcategoria);
    setIsModalSubcategoriesOpen(true);
  };

  const confirmDeleteSubcategory = async (id: number) => {
    try {
      const response = await deleteSubCategory(id)
      message.success({ content: response.message, key: 'deleteSubcategory', duration: 3 });
      fetchCategories()
      fetchSubcategories(actualCategory as number)
    } catch (error: any) {
      message.error({ content: error.response.data.message , key: 'deleteSubcategory', duration: 3 });
    }
  };

  const pagination: TablePaginationConfig = {
    defaultPageSize: 5,
    defaultCurrent: 1,
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
  };

  const columns: ColumnsType<Categoria> = [
    {
      title: 'Código',
      dataIndex: 'id',
      sorter: (a, b) => (a?.id || 0) - (b?.id || 0),
      render: (id) => id?.toString() || '',
      width: '10%',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      render: (nombre) => nombre || '',    
      width: '20%',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      render: (descripcion) => descripcion || '',
      width: '50%',
      // width: '10%',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      render: (estado) => estado ? 'Activo' : 'Inactivo',
      width: '10%',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      render: (acciones, record) => (
        <div>
          <Popconfirm
            title="Crear subcategoría"
            onConfirm={() => confirmCreateSubcategory(Number(record?.id))}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px', marginRight: '10px'}} >
              <PlusCircleIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Editar categoría"
            onConfirm={() => confirmEditCategory(record)}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px', marginRight: '10px'}}>
              <PencilSquareIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Eliminar categoría"
            description="Se eliminará la categoría y todas sus subcategorías. ¿Está seguro?"
            onConfirm={() => confirmDeleteCategory(Number(record.id))}
            okText="Si"
            cancelText="No"
          >
            <Button type="default" size="small" style={{padding: '0px'}}>
              <TrashIcon style={{width: '24px', height: '24px'}} />
            </Button>
          </Popconfirm>
        </div>
      ),
      width: '10%',
    }
  ];
  
  const expandedRowRender = (record: Categoria) => {
    const columnsSubcategories: ColumnsType<SubCategoria> = [
      {
        title: 'Subcategoría',
        dataIndex: 'nombre',
        render: (nombre) => nombre || '',
        width: '20%',
      },
      {
        title: 'Descripción',
        dataIndex: 'descripcion',
        render: (descripcion) => descripcion || '',
        width: '60%',
      },
      {
        title: 'Estado',
        dataIndex: 'estado',
        render: (estado) => estado ? 'Activo' : 'Inactivo',
        width: '10%',
      },
      {
        title: 'Acciones',
        dataIndex: 'acciones',
        render: (acciones, record) => (
          <div>
            <Popconfirm
              title="Editar subcategoría"
              onConfirm={() => confirmEditSubcategory(record)}
              okText="Si"
              cancelText="No"
            >
              <Button type="default" size="small" style={{padding: '0px', marginRight: '10px'}}>
                <PencilSquareIcon style={{width: '24px', height: '24px'}} />
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Eliminar subcategoría"
              description="¿Está seguro que desea eliminar la subcategoría?"
              onConfirm={() => confirmDeleteSubcategory(Number(record.id))}
              okText="Si"
              cancelText="No"
            >
              <Button type="default" size="small" style={{padding: '0px'}}>
                <TrashIcon style={{width: '24px', height: '24px'}} />
              </Button>
            </Popconfirm>
          </div>
        ),
        width: '10%',
      }
    ];
    return <Table columns={columnsSubcategories} dataSource={subcategories} pagination={false} rowKey={'id'} />;
  }

  return (
    <>
      <Layout
        title="Categorias"
      >
        <h2 style={{marginTop: 0}}>Categorías</h2>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
            <Button type="primary" onClick={handleOpenModal}>Crear Categoría</Button>
          </div>
          <div>
            <ListadoCategoriasFilter categorias={categories} categoriasFiltered={categoriasFiltered} setCategoriasFiltered={setCategoriasFiltered} />
            <Table columns={columns} dataSource={categoriasFiltered} onChange={handleChange} pagination={pagination} rowKey={'id'} expandable={{ 
              expandedRowRender: expandedRowRender,
              onExpand: async (expanded, record) => {
                if (expanded) {
                  await fetchSubcategories(Number(record?.id));
                  setLastExpandedRowId(record.id);
                } else {
                  setLastExpandedRowId(null);
                }
              },
              expandedRowKeys: [lastExpandedRowId || ''],
            }}
            />
          </div>
        </div>
      </Layout>
      {isModalOpen && 
        <CategoriasModal 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          categoryEdit={categoryEdit} 
          setCategoryEdit={setCategoryEdit} 
        />
      }
      {isModalSubcategoriesOpen && 
        <SubcategoriasModal 
          isModalSubcategoriesOpen={isModalSubcategoriesOpen} 
          setIsModalSubcategoriesOpen={setIsModalSubcategoriesOpen} 
          categoryId={idCategory} 
          subcategoryEdit={subcategoryEdit}
          setSubcategoryEdit={setSubcategoryEdit} 
        />
      }
    </>
  )
}
