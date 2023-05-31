import { useState, useEffect } from "react";

type FilteredData<T> = T[];

const useFilters = <T extends {}>(array: T[], filtros: Record<string, string | number | boolean>) => {
  const [filteredData, setFilteredData] = useState<FilteredData<T>>([]);
  const [filtrosState, setFiltrosState] = useState<Record<string, string | number | boolean>>(filtros)

  useEffect(() => {
    if (array.length) setFilteredData(array)
  }, [array, filtros])

  useEffect(() => {
    let data = [...array];
    if ('search' in filtrosState) {
      data = data.filter((item: any) =>
        Object.keys(item).some(
          (key) =>
            typeof item[key] === 'string' &&
            item[key].toLowerCase().includes((filtrosState.search as string).toLowerCase())
        )
      );
    }
    if ('estado' in filtrosState) {
      data = data.filter((item: any) => item.estado === filtrosState.estado);
    }
    if ('stockActual' in filtrosState) {
      data = data.filter((item: any) => item.stockActual < item.stockMinimo);
    }
    setFilteredData(data);
    console.log( filteredData )
  }, [filtrosState])

  const handleChange = (key: string, value: string | number | boolean) => {
    setFiltrosState({ ...filtrosState, [key]: value });
  };

  const FilterComponent = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', backgroundColor: 'white', padding: '10px 20px', borderRadius: '10px' }}>
        {'search' in filtros && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>Buscar:</span>
            <input
              style={{ width: '200px' }}
              type="text"
              value={filtrosState.search as string}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        )}
        {'estado' in filtros && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>Estado:</span>
            <input
              type="checkbox"
              checked={filtrosState.estado as boolean}
              onChange={(e) => handleChange('estado', e.target.checked)}
            />
            <span style={{ marginLeft: '0.2rem' }}>Activo</span>
          </div>
        )}
        {'stockActual' in filtros && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>Stock actual menor al mínimo</span>
            <input
              type="checkbox"
              checked={filtrosState.stockActual as boolean}
              onChange={(e) => handleChange('stockActual', e.target.checked)}
            />
          </div>
        )}
      </div>
    )
  }

  return [
    filteredData,
    FilterComponent
  ] as const;
}

export default useFilters;