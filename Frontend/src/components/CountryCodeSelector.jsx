import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

// Lista de códigos de país con banderas
const countryCodes = [
  { code: '+1', country: 'Estados Unidos/Canadá', flag: '🇺🇸' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+34', country: 'España', flag: '🇪🇸' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '+33', country: 'Francia', flag: '🇫🇷' },
  { code: '+49', country: 'Alemania', flag: '🇩🇪' },
  { code: '+39', country: 'Italia', flag: '🇮🇹' }
];

const CountryCodeSelector = ({ value, onChange, disabled = false, error = false, helperText = '' }) => {
  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      <InputLabel id="country-code-label">Código País</InputLabel>
      <Select
        labelId="country-code-label"
        id="country-code-select"
        value={value || ''}
        label="Código País"
        onChange={(e) => onChange(e.target.value)}
        renderValue={(selected) => {
          const country = countryCodes.find(c => c.code === selected);
          return country ? `${country.flag} ${country.code}` : selected;
        }}
      >
        {countryCodes.map((option) => (
          <MenuItem key={option.code} value={option.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '1.2rem' }}>{option.flag}</Typography>
              <Typography sx={{ fontWeight: 500 }}>{option.code}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                {option.country}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography variant="caption" color={error ? 'error' : 'text.secondary'} sx={{ mt: 0.5, ml: 1.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

export default CountryCodeSelector;