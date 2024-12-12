export function getDatePath(dateString?: string): string {
  // Si no se recibe una fecha, se utiliza la fecha actual
  const date = dateString ? new Date(dateString) : new Date();

  // Obtener el año y mes de la fecha proporcionada
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Los meses son 0-indexados, por lo que sumamos 1.

  // Formatear el mes a dos dígitos (Ej: 1 -> 01)
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;

  // Obtener el día de la semana
  const daysOfWeek = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  const dayOfWeek = daysOfWeek[date.getDay()];

  // Formar la ruta base en el formato deseado
  const path = `${year}${formattedMonth}/${formattedMonth}${dayOfWeek}`;

  return path;
}
