import { Component, ErrorInfo, ReactNode } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = {
    hasError: false,
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: any) {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo)
  }

  private resetError() {
    this.setState({ hasError: false })
  }

  handleRefresh = () => {
    this.resetError()
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <div className="bg-slate-100 min-h-screen flex justify-center items-center flex-col gap-2">
            <h2 className="text-center text-lg">
              Ocurrio un error al cargar la pagina
            </h2>
            <p className="text-center">
              Puede que exista una actualizacion, prueba recargar o{' '}
              <span className="text-sm bg-slate-200 p-1 rounded-md">
                Ctrl + Mayus + r
              </span>
            </p>
            <p className="text-slate-500">
              Si el problema persiste, contacte con el desarrollador
            </p>
          </div>
        </>
      )
    }

    return this.props.children
  }
}
