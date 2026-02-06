import { EUROPEAN_COUNTRIES } from "@/lib/countries";

interface CountrySelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  lang: "fr" | "en";
  disabled?: boolean;
  className?: string;
  required?: boolean;
  showPlaceholder?: boolean;
}

export function CountrySelect({
  id,
  name,
  value,
  onChange,
  lang,
  disabled = false,
  className = "",
  required = false,
  showPlaceholder = false,
}: CountrySelectProps) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={className}
    >
      {showPlaceholder && (
        <option value="">
          {lang === "fr" ? "Sélectionnez un pays" : "Select a country"}
        </option>
      )}
      {EUROPEAN_COUNTRIES.map((country) => (
        <option key={country.code} value={country.code}>
          {country.flag} {country.name[lang]}
        </option>
      ))}
    </select>
  );
}
