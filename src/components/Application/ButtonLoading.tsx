import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ButtonLoadingProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    loading?: boolean
}

export function ButtonLoading({ type, text, loading = false, className , onClick, ...props }: ButtonLoadingProps) {
    return (
        <Button disabled={loading} type={type} onClick={onClick} {...props} className={cn('' , className )}>
            {loading ? (
                <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </>
            ) : (
                text
            )}
        </Button>
    )
}
