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
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  placeholder,
  options,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Label>{label}</Label>
      <Select onValueChange={onChange}>
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
    </div>
  )
}
