import { type ReactNode } from "react"
import { Button } from "../ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backTo?: string
  actions?: ReactNode
}

export function PageHeader({ 
  title, 
  subtitle, 
  showBackButton = false, 
  backTo = "/",
  actions 
}: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(backTo)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}