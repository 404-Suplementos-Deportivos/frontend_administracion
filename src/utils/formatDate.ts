export const formatFecha = (date: string) => {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dia = date.split('-')[2];
  const mes = meses[Number(date.split('-')[1]) - 1];
  const anio = date.split('-')[0];

  return `${dia} de ${mes} de ${anio}`;
}