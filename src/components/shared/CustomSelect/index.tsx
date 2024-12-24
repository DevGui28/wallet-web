import { cn } from '../../../lib/utils'
import { Label } from '../../ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'

interface CustomSelectProps {
  label: string
  placeholder: string
  options: { value: string; label: string }[]
  onChange?: (value: string) => void
  className?: string
  value: string | null
  description?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  placeholder,
  options,
  onChange,
  className,
  value,
  description,
}) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Label>{label}</Label>
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {description && (
        <p className="text-xs text-card-foreground/60">{description}</p>
      )}
    </div>
  )
}
