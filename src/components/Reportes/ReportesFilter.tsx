import { useState, useEffect } from "react"
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import { Categoria } from "@/interfaces/Reportes/Categoria";

interface ReportesFilterProps {
  fechaDesde: string
  fechaHasta: string
  setFechaDesde: (fecha: string) => void
  setFechaHasta: (fecha: string) => void
  categorias: Categoria[]
  setCategoriaSelected: (categoria: string) => void
}

const { RangePicker } = DatePicker;

const ReportesFilter = ({fechaDesde, fechaHasta, setFechaDesde, setFechaHasta, categorias, setCategoriaSelected}: ReportesFilterProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.name) {
      case 'tipoCategoria':
        setCategoriaSelected(e.target.value)
        break;
      default:
        break;
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
      backgroundColor: 'white',
      padding: '10px 20px',
      borderRadius: '10px',
      position: 'sticky',
      top: '20px',
      zIndex: 1,
    }} >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px'}}>
        <div>
          <span style={{marginRight: '0.5rem'}}>Fecha:</span>
          <RangePicker 
            onChange={(dates, dateStrings) => {
              setFechaDesde(dateStrings[0])
              setFechaHasta(dateStrings[1])
            }}
          />
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px'}}>
        <div>
          <span style={{marginRight: '0.5rem'}}>Categoría:</span>
          <select
            style={{width: '200px'}}
            name="tipoCategoria"
            onChange={handleChange}
          >
            <option value="0">Todas</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default ReportesFilter