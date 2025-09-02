// Datos geográficos para selectores de clientes
export const geoData = {
  // México
  'México': {
    name: 'México',
    phoneCode: '+52',
    states: {
      'Aguascalientes': {
        name: 'Aguascalientes',
        cities: ['Aguascalientes', 'Calvillo', 'Jesús María', 'Rincón de Romos', 'San José de Gracia']
      },
      'Baja California': {
        name: 'Baja California',
        cities: ['Tijuana', 'Mexicali', 'Ensenada', 'San Felipe', 'Rosarito']
      },
      'Baja California Sur': {
        name: 'Baja California Sur',
        cities: ['La Paz', 'Los Cabos', 'Loreto', 'Comondú', 'Mulegé']
      },
      'Campeche': {
        name: 'Campeche',
        cities: ['Campeche', 'Ciudad del Carmen', 'Champotón', 'Escárcega', 'Palizada']
      },
      'Chiapas': {
        name: 'Chiapas',
        cities: ['Tuxtla Gutiérrez', 'San Cristóbal de las Casas', 'Tapachula', 'Comitán', 'Chiapa de Corzo']
      },
      'Chihuahua': {
        name: 'Chihuahua',
        cities: ['Chihuahua', 'Ciudad Juárez', 'Delicias', 'Cuauhtémoc', 'Parral']
      },
      'Ciudad de México': {
        name: 'Ciudad de México',
        cities: ['Cuauhtémoc', 'Miguel Hidalgo', 'Coyoacán', 'Álvaro Obregón', 'Tlalpan', 'Xochimilco', 'Iztapalapa', 'Venustiano Carranza', 'Azcapotzalco', 'Iztacalco', 'Magdalena Contreras', 'Tláhuac', 'Milpa Alta', 'Gustavo A. Madero']
      },
      'Coahuila': {
        name: 'Coahuila',
        cities: ['Saltillo', 'Torreón', 'Monclova', 'Piedras Negras', 'Ramos Arizpe']
      },
      'Colima': {
        name: 'Colima',
        cities: ['Colima', 'Manzanillo', 'Villa de Álvarez', 'Comala', 'Coquimatlán']
      },
      'Durango': {
        name: 'Durango',
        cities: ['Durango', 'Gómez Palacio', 'Lerdo', 'El Oro', 'Santiago Papasquiaro']
      },
      'Estado de México': {
        name: 'Estado de México',
        cities: ['Ecatepec', 'Nezahualcóyotl', 'Naucalpan', 'Toluca', 'Chimalhuacán', 'Cuautitlán Izcalli', 'Atizapán de Zaragoza', 'Ixtapaluca', 'Tultitlán', 'Ixtlahuaca']
      },
      'Guanajuato': {
        name: 'Guanajuato',
        cities: ['León', 'Irapuato', 'Celaya', 'Salamanca', 'Guanajuato', 'San Miguel de Allende', 'Dolores Hidalgo', 'Silao', 'Valle de Santiago', 'Pénjamo']
      },
      'Guerrero': {
        name: 'Guerrero',
        cities: ['Acapulco', 'Chilpancingo', 'Iguala', 'Chilapa', 'Tlapa', 'Ayutla', 'Atoyac', 'Técpan de Galeana', 'San Marcos', 'Coyuca de Benítez']
      },
      'Hidalgo': {
        name: 'Hidalgo',
        cities: ['Pachuca', 'Tula', 'Tizayuca', 'Actopan', 'Mixquiahuala', 'Zimapán', 'Ixmiquilpan', 'Tulancingo', 'Huejutla', 'San Salvador']
      },
      'Jalisco': {
        name: 'Jalisco',
        cities: ['Guadalajara', 'Zapopan', 'San Pedro Tlaquepaque', 'Tlaquepaque', 'Tonalá', 'Puerto Vallarta', 'Lagos de Moreno', 'El Salto', 'Tepatitlán', 'Zapotlán el Grande']
      },
      'Michoacán': {
        name: 'Michoacán',
        cities: ['Morelia', 'Uruapan', 'Zamora', 'Lázaro Cárdenas', 'Hidalgo', 'Apatzingán', 'Zitácuaro', 'La Piedad', 'Pátzcuaro', 'Sahuayo']
      },
      'Morelos': {
        name: 'Morelos',
        cities: ['Cuernavaca', 'Jiutepec', 'Temixco', 'Ayala', 'Emiliano Zapata', 'Puente de Ixtla', 'Xochitepec', 'Cuautla', 'Amacuzac', 'Puente de Ixtla']
      },
      'Nayarit': {
        name: 'Nayarit',
        cities: ['Tepic', 'Bahía de Banderas', 'Santiago Ixcuintla', 'Ixtlán del Río', 'San Blas', 'Xalisco', 'Compostela', 'Tuxpan', 'San Pedro Lagunillas', 'Ixtlán del Río']
      },
      'Nuevo León': {
        name: 'Nuevo León',
        cities: ['Monterrey', 'Guadalupe', 'San Nicolás de los Garza', 'General Escobedo', 'Santa Catarina', 'San Pedro Garza García', 'Juárez', 'Linares', 'Lampazos de Naranjo', 'General Terán']
      },
      'Oaxaca': {
        name: 'Oaxaca',
        cities: ['Oaxaca de Juárez', 'Tuxtepec', 'Santa Cruz Xoxocotlán', 'Villa de Zaachila', 'Santa Lucía del Camino', 'San Antonio de la Cal', 'Santa Cruz Amilpas', 'San Agustín de las Juntas', 'San Raymundo Jalpan', 'Santa María Atzompa']
      },
      'Puebla': {
        name: 'Puebla',
        cities: ['Puebla', 'Amozoc', 'Atlixco', 'Cuautlancingo', 'San Pedro Cholula', 'San Andrés Cholula', 'Tehuacán', 'San Martín Texmelucan', 'San Pedro Cholula', 'San Andrés Cholula']
      },
      'Querétaro': {
        name: 'Querétaro',
        cities: ['Querétaro', 'San Juan del Río', 'Corregidora', 'El Marqués', 'Pedro Escobedo', 'Amealco de Bonfil', 'Colón', 'Jalpan', 'Cadereya', 'Tequisquiapan']
      },
      'Quintana Roo': {
        name: 'Quintana Roo',
        cities: ['Benito Juárez', 'Othón P. Blanco', 'Solidaridad', 'Felipe Carrillo Puerto', 'Lázaro Cárdenas', 'José María Morelos', 'Isla Mujeres', 'Cozumel', 'Tulum', 'Bacalar']
      },
      'San Luis Potosí': {
        name: 'San Luis Potosí',
        cities: ['San Luis Potosí', 'Soledad de Graciano Sánchez', 'Ciudad Valles', 'Matehuala', 'Ciudad Fernández', 'Xilitla', 'Rioverde', 'Ciudad Valles', 'Tamazunchale', 'San Martín Chalchicuautla']
      },
      'Sinaloa': {
        name: 'Sinaloa',
        cities: ['Culiacán', 'Mazatlán', 'Los Mochis', 'Guasave', 'Navolato', 'El Rosario', 'El Fuerte', 'Sinaloa de Leyva', 'Badiraguato', 'Concordia']
      },
      'Sonora': {
        name: 'Sonora',
        cities: ['Hermosillo', 'Ciudad Obregón', 'Nogales', 'San Luis Río Colorado', 'Huatabampo', 'Puerto Peñasco', 'Cananea', 'Navojoa', 'Guaymas', 'Agua Prieta']
      },
      'Tabasco': {
        name: 'Tabasco',
        cities: ['Centro', 'Cárdenas', 'Comalcalco', 'Cunduacán', 'Huimanguillo', 'Jalpa de Méndez', 'Macuspana', 'Nacajuca', 'Paraíso', 'Tacotalpa']
      },
      'Tamaulipas': {
        name: 'Tamaulipas',
        cities: ['Reynosa', 'Matamoros', 'Nuevo Laredo', 'Victoria', 'Tampico', 'Ciudad Madero', 'Altamira', 'Río Bravo', 'Mante', 'San Fernando']
      },
      'Tlaxcala': {
        name: 'Tlaxcala',
        cities: ['Tlaxcala', 'San Pablo del Monte', 'Calpulalpan', 'Chiautempan', 'Contla de Juan Cuamatzi', 'Papalotla de Xicohténcatl', 'Sanctórum de Lázaro Cárdenas', 'Tlaxco', 'Huamantla', 'Zacatelco']
      },
      'Veracruz': {
        name: 'Veracruz',
        cities: ['Veracruz', 'Xalapa', 'Coatzacoalcos', 'Córdoba', 'Orizaba', 'Poza Rica de Hidalgo', 'San Andrés Tuxtla', 'Tuxpan', 'Minatitlán', 'San Juan Evangelista']
      },
      'Yucatán': {
        name: 'Yucatán',
        cities: ['Mérida', 'Valladolid', 'Progreso', 'Kanasín', 'Umán', 'Tekax', 'Izamal', 'Hunucmá', 'Tizimín', 'Motul']
      },
      'Zacatecas': {
        name: 'Zacatecas',
        cities: ['Zacatecas', 'Fresnillo', 'Sombrerete', 'Calera', 'Ojocaliente', 'Loreto', 'Nochistlán', 'Jalpa', 'Luis Moya', 'Genaro Codina']
      }
    }
  },
  
  // Colombia
  'Colombia': {
    name: 'Colombia',
    phoneCode: '+57',
    states: {
      'Antioquia': {
        name: 'Antioquia',
        cities: ['Medellín', 'Bello', 'Envigado', 'Itagüí', 'Sabaneta', 'Rionegro', 'La Estrella', 'Copacabana', 'Girardota', 'Barbosa', 'Caldas', 'La Ceja', 'Marinilla', 'Guarne', 'Santuario', 'El Retiro', 'La Unión', 'San Vicente', 'Carmen de Viboral', 'Granada']
      },
      'Cundinamarca': {
        name: 'Cundinamarca',
        cities: ['Bogotá', 'Soacha', 'Facatativá', 'Zipaquirá', 'Chía', 'Girardot', 'Fusagasugá', 'Madrid', 'Mosquera', 'Funza', 'Cajicá', 'Tocancipá', 'Gachancipá', 'Sopó', 'Guasca', 'Sesquilé', 'Guatavita', 'Suesca', 'Chocontá', 'Villapinzón']
      },
      'Valle del Cauca': {
        name: 'Valle del Cauca',
        cities: ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Buga', 'Yumbo', 'Cartago', 'Jamundí', 'La Unión', 'Zarzal', 'Florida', 'Pradera', 'Dagua', 'La Cumbre', 'Restrepo', 'Andalucía', 'Roldanillo', 'Toro', 'Obando', 'El Cerrito']
      },
      'Atlántico': {
        name: 'Atlántico',
        cities: ['Barranquilla', 'Soledad', 'Malambo', 'Galapa', 'Baranoa', 'Sabanagrande', 'Palmar de Varela', 'Candelaria', 'Luruaco', 'Piojó', 'Santo Tomás', 'Repelón', 'Manatí', 'Campo de la Cruz', 'Santa Lucía', 'Suán', 'Juan de Acosta', 'Ponedera', 'Sabanalarga', 'Luruaco']
      },
      'Bolívar': {
        name: 'Bolívar',
        cities: ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'San Juan Nepomuceno', 'El Carmen de Bolívar', 'María La Baja', 'San Jacinto', 'Clemencia', 'Santa Rosa del Sur', 'Mompós', 'Pinillos', 'San Fernando', 'Hatillo de Loba', 'Margarita', 'San Martín de Loba', 'Barranco de Loba', 'El Peñón', 'Regidor', 'Río Viejo']
      },
      'Santander': {
        name: 'Santander',
        cities: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'San Gil', 'Málaga', 'Socorro', 'Charalá', 'Vélez', 'Puente Nacional', 'Barbosa', 'Rionegro', 'Zapatoca', 'Betulia', 'Lebrija', 'Los Santos', 'Curití', 'Encino', 'Guaca']
      },
      'Boyacá': {
        name: 'Boyacá',
        cities: ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Villa de Leyva', 'Moniquirá', 'Samacá', 'Nobsa', 'Tibasosa', 'Sáchica', 'Ráquira', 'Sutamarchán', 'Tinjacá', 'Combita', 'Oicatá', 'Chivatá', 'Sora', 'Soracá', 'Toca']
      },
      'Cesar': {
        name: 'Cesar',
        cities: ['Valledupar', 'Aguachica', 'Agustín Codazzi', 'La Paz', 'San Alberto', 'San Martín', 'Pelaya', 'Gamarra', 'La Gloria', 'Río de Oro', 'Curumaní', 'Chimichagua', 'Tamalameque', 'Pailitas', 'Becerril', 'Manaure', 'San Diego', 'Astrea', 'Bosconia', 'El Copey']
      },
      'Córdoba': {
        name: 'Córdoba',
        cities: ['Montería', 'Cereté', 'Sahagún', 'Lorica', 'Planeta Rica', 'Tierralta', 'Montelíbano', 'Puerto Libertador', 'San Antero', 'San Bernardo del Viento', 'Ciénaga de Oro', 'Ayapel', 'Buenavista', 'Canalete', 'Chimá', 'Los Córdobas', 'Momil', 'Moñitos', 'Pueblo Nuevo', 'Purísima']
      },
      'Magdalena': {
        name: 'Magdalena',
        cities: ['Santa Marta', 'Ciénaga', 'Fundación', 'Aracataca', 'El Retén', 'Plato', 'Pivijay', 'Salamina', 'Algarrobo', 'Concordia', 'El Piñón', 'Remolino', 'Sabanas de San Ángel', 'San Sebastián de Buenavista', 'San Zenón', 'Santa Ana', 'Sitionuevo', 'Tenerife', 'Zapayán', 'Zona Bananera']
      },
      'La Guajira': {
        name: 'La Guajira',
        cities: ['Riohacha', 'Maicao', 'Manaure', 'Uribia', 'Fonseca', 'Barrancas', 'Hatonuevo', 'Albania', 'Dibulla', 'El Molino', 'San Juan del Cesar', 'Distracción', 'La Jagua del Pilar', 'Urumita', 'Villanueva', 'El Retorno', 'San José del Guaviare', 'Calamar', 'Miraflores', 'El Retorno']
      },
      'Norte de Santander': {
        name: 'Norte de Santander',
        cities: ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios', 'El Zulia', 'Tibú', 'Bucarasica', 'Sardinata', 'Abrego', 'Chinácota', 'Durania', 'Herrán', 'La Playa', 'Mutiscua', 'Pamplonita', 'Ragonvalia', 'Salazar', 'San Calixto', 'Santiago']
      },
      'Caldas': {
        name: 'Caldas',
        cities: ['Manizales', 'La Dorada', 'Chinchiná', 'Villamaría', 'Riosucio', 'Anserma', 'Salamina', 'Aguadas', 'Pácora', 'Filadelfia', 'Marmato', 'Supía', 'Aranzazu', 'Pensilvania', 'Marquetalia', 'Manzanares', 'Victoria', 'Marulanda', 'Palestina', 'Neira']
      },
      'Risaralda': {
        name: 'Risaralda',
        cities: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia', 'Belén de Umbría', 'Quinchía', 'Guática', 'Marsella', 'Mistrató', 'Pueblo Rico', 'Santuario', 'Apía', 'Balboa', 'La Celia', 'La Tebaida', 'Ulloa', 'Valle de San Juan', 'Buenavista', 'Chinchiná', 'San Clemente']
      },
      'Quindío': {
        name: 'Quindío',
        cities: ['Armenia', 'Calarcá', 'La Tebaida', 'Circasia', 'Montenegro', 'Quimbaya', 'Salento', 'Pijao', 'Córdoba', 'Buenavista', 'Génova', 'Filandia', 'Ulloa', 'Alcalá', 'Cáceres', 'Caicedo', 'Caucasia', 'El Bagre', 'Nechí', 'Tarazá']
      },
      'Tolima': {
        name: 'Tolima',
        cities: ['Ibagué', 'Espinal', 'Honda', 'Mariquita', 'Líbano', 'Fresno', 'Lérida', 'Ambalema', 'Falan', 'Herveo', 'Líbano', 'Mariquita', 'Melgar', 'Piedras', 'Purificación', 'San Luis', 'Suárez', 'Valle de San Juan', 'Venadillo', 'Villahermosa']
      },
      'Huila': {
        name: 'Huila',
        cities: ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre', 'Palermo', 'San Agustín', 'Timaná', 'Aipe', 'Rivera', 'Yaguará', 'Tello', 'Teruel', 'Villavieja', 'Colombia', 'Hobo', 'Iquira', 'Nátaga', 'Oporapa', 'Paicol']
      },
      'Cauca': {
        name: 'Cauca',
        cities: ['Popayán', 'Santander de Quilichao', 'Patía', 'Puerto Tejada', 'Piendamó', 'El Tambo', 'Cajibío', 'Timbío', 'Miranda', 'Corinto', 'Caloto', 'Villa Rica', 'Guachené', 'López', 'Morales', 'Padilla', 'Puerto Tejada', 'Santander de Quilichao', 'Suárez', 'Timbío']
      },
      'Nariño': {
        name: 'Nariño',
        cities: ['Pasto', 'Tumaco', 'Ipiales', 'La Unión', 'Túquerres', 'El Charco', 'La Tola', 'Francisco Pizarro', 'Mosquera', 'Olaya Herrera', 'Roberto Payán', 'Magüí', 'Barbacoas', 'El Rosario', 'Leiva', 'Policarpa', 'Cumbitara', 'El Tablón de Gómez', 'San Bernardo', 'Buesaco']
      },
      'Putumayo': {
        name: 'Putumayo',
        cities: ['Mocoa', 'Puerto Asís', 'Orito', 'Villagarzón', 'Puerto Guzmán', 'Puerto Leguízamo', 'San Miguel', 'Santiago', 'Valle del Guamuéz', 'Puerto Caicedo', 'Colón', 'San Francisco', 'La Hormiga', 'El Encanto', 'Puerto Alegría', 'Tarapacá', 'La Victoria', 'Puerto Arica', 'Puerto Nariño', 'Leticia']
      },
      'Amazonas': {
        name: 'Amazonas',
        cities: ['Leticia', 'Puerto Nariño', 'La Chorrera', 'El Encanto', 'La Pedrera', 'Mirití-Paraná', 'Puerto Alegría', 'Puerto Arica', 'Puerto Santander', 'Tarapacá', 'Puerto Leguízamo', 'San Francisco', 'Valle del Guamuéz', 'Puerto Caicedo', 'Colón', 'San Francisco', 'La Hormiga', 'El Encanto', 'Puerto Alegría', 'Puerto Arica']
      },
      'Meta': {
        name: 'Meta',
        cities: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'Puerto Gaitán', 'Puerto Lleras', 'Puerto Rico', 'Mapiripán', 'Puerto Concordia', 'Puerto Carreño', 'Puerto Inírida', 'Puerto Ayacucho', 'Puerto Páez', 'Puerto Carreño', 'Puerto Inírida', 'Puerto Ayacucho', 'Puerto Páez', 'Puerto Carreño', 'Puerto Inírida', 'Puerto Ayacucho']
      },
      'Casanare': {
        name: 'Casanare',
        cities: ['Yopal', 'Aguazul', 'Villanueva', 'Pore', 'Tauramena', 'Monterrey', 'Orocué', 'Paz de Ariporo', 'Hato Corozal', 'San Luis de Palenque', 'Trinidad', 'Recetor', 'Sabanalarga', 'Chámeza', 'Nunchía', 'La Salina', 'Sácama', 'Támara', 'Maní', 'San Luis de Palenque']
      },
      'Arauca': {
        name: 'Arauca',
        cities: ['Arauca', 'Tame', 'Arauquita', 'Cravo Norte', 'Fortul', 'Puerto Rondón', 'Saravena', 'Arauquita', 'Cravo Norte', 'Fortul', 'Puerto Rondón', 'Saravena', 'Arauquita', 'Cravo Norte', 'Fortul', 'Puerto Rondón', 'Saravena', 'Arauquita', 'Cravo Norte', 'Fortul']
      },
      'Vichada': {
        name: 'Vichada',
        cities: ['Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo', 'Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo', 'Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo', 'Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo', 'Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo']
      },
      'Guainía': {
        name: 'Guainía',
        cities: ['Inírida', 'Barranco Minas', 'Mapiripana', 'San Felipe', 'Pana Pana', 'Morichal', 'Inírida', 'Barranco Minas', 'Mapiripana', 'San Felipe', 'Pana Pana', 'Morichal', 'Inírida', 'Barranco Minas', 'Mapiripana', 'San Felipe', 'Pana Pana', 'Morichal', 'Inírida', 'Barranco Minas']
      },
      'Guaviare': {
        name: 'Guaviare',
        cities: ['San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores', 'San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores', 'San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores', 'San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores', 'San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores']
      },
      'Vaupés': {
        name: 'Vaupés',
        cities: ['Mitú', 'Carurú', 'Pacoa', 'Taraira', 'Mitú', 'Carurú', 'Pacoa', 'Taraira', 'Mitú', 'Carurú', 'Pacoa', 'Taraira', 'Mitú', 'Carurú', 'Pacoa', 'Taraira', 'Mitú', 'Carurú', 'Pacoa', 'Taraira']
      },
      'Chocó': {
        name: 'Chocó',
        cities: ['Quibdó', 'Istmina', 'Condoto', 'Tadó', 'Atrato', 'Bojayá', 'El Litoral del San Juan', 'Medio Atrato', 'Medio Baudó', 'Medio San Juan', 'Novita', 'Nuquí', 'Río Iro', 'Río Quito', 'San José del Palmar', 'Sipí', 'Unguía', 'Unión Panamericana', 'Bagadó', 'Carmen del Darién']
      },
      'San Andrés y Providencia': {
        name: 'San Andrés y Providencia',
        cities: ['San Andrés', 'Providencia', 'San Andrés', 'Providencia', 'San Andrés', 'Providencia', 'San Andrés', 'Providencia', 'San Andrés', 'Providencia', 'San Andrés', 'Providencia', 'San Andrés', 'Providencia', 'San Andrés', 'Providencia', 'San Andrés', 'Providencia', 'San Andrés', 'Providencia']
      }
    }
  },
  
  // Estados Unidos
  'Estados Unidos': {
    name: 'Estados Unidos',
    phoneCode: '+1',
    states: {
      'California': {
        name: 'California',
        cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim']
      },
      'Texas': {
        name: 'Texas',
        cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock']
      },
      'Florida': {
        name: 'Florida',
        cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Cape Coral', 'Port St. Lucie']
      },
      'Nueva York': {
        name: 'Nueva York',
        cities: ['Nueva York', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica']
      },
      'Illinois': {
        name: 'Illinois',
        cities: ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield', 'Peoria', 'Elgin', 'Waukegan', 'Champaign']
      }
    }
  },
  
  // El Salvador
  'El Salvador': {
    name: 'El Salvador',
    phoneCode: '+503',
    states: {
      'San Salvador': {
        name: 'San Salvador',
        cities: ['San Salvador', 'Soyapango', 'Mejicanos', 'Cuscatancingo', 'Aguilares', 'Nejapa', 'Delgado', 'Tonacatepeque', 'Ilopango', 'San Martín']
      },
      'La Libertad': {
        name: 'La Libertad',
        cities: ['Santa Tecla', 'San Juan Opico', 'Quezaltepeque', 'Colón', 'Jayaque', 'Teotepeque', 'Comasagua', 'Zaragoza', 'Huizúcar', 'Tamanique']
      },
      'Santa Ana': {
        name: 'Santa Ana',
        cities: ['Santa Ana', 'Chalchuapa', 'Coatepeque', 'El Congo', 'Metapán', 'Masahuat', 'San Antonio Pajonal', 'Santiago de la Frontera', 'Texistepeque', 'Candelaria de la Frontera']
      },
      'Sonsonate': {
        name: 'Sonsonate',
        cities: ['Sonsonate', 'Izalco', 'Acajutla', 'Armenia', 'Santo Domingo de Guzmán', 'Juayúa', 'Nahuizalco', 'Salcoatitán', 'Caluco', 'San Antonio del Monte']
      },
      'Ahuachapán': {
        name: 'Ahuachapán',
        cities: ['Ahuachapán', 'Apaneca', 'Atiquizaya', 'Concepción de Ataco', 'El Refugio', 'Guaymango', 'Jujutla', 'San Francisco Menéndez', 'San Lorenzo', 'San Pedro Puxtla']
      }
    }
  },
  
  // Guatemala
  'Guatemala': {
    name: 'Guatemala',
    phoneCode: '+502',
    states: {
      'Guatemala': {
        name: 'Guatemala',
        cities: ['Ciudad de Guatemala', 'Villa Nueva', 'Mixco', 'San Miguel Petapa', 'Villa Canales', 'San José Pinula', 'Santa Catarina Pinula', 'San José del Golfo', 'Palencia', 'Chinautla']
      },
      'Quetzaltenango': {
        name: 'Quetzaltenango',
        cities: ['Quetzaltenango', 'Salcajá', 'Olintepeque', 'San Carlos Sija', 'Sibilia', 'Cabricán', 'Cajolá', 'San Miguel Sigüilá', 'Ostuncalco', 'San Mateo']
      },
      'Escuintla': {
        name: 'Escuintla',
        cities: ['Escuintla', 'Santa Lucía Cotzumalguapa', 'La Democracia', 'Siquinalá', 'Masagua', 'Tiquisate', 'La Gomera', 'Guanagazapa', 'San José', 'Iztapa']
      },
      'Huehuetenango': {
        name: 'Huehuetenango',
        cities: ['Huehuetenango', 'Chiantla', 'Malacatancito', 'Cuilco', 'Nentón', 'San Pedro Necta', 'Jacaltenango', 'Soloma', 'Ixtahuacán', 'Santa Bárbara']
      },
      'Alta Verapaz': {
        name: 'Alta Verapaz',
        cities: ['Cobán', 'San Pedro Carchá', 'San Juan Chamelco', 'San Cristóbal Verapaz', 'Tactic', 'Tamahú', 'Tucurú', 'Panzós', 'Senahú', 'San Agustín Lanquín']
      }
    }
  }
};

// Función para obtener países
export const getCountries = () => {
  return Object.keys(geoData).map(country => ({
    value: country,
    label: country
  }));
};

// Función para obtener estados de un país
export const getStates = (country) => {
  if (!country || !geoData[country]) return [];
  
  return Object.keys(geoData[country].states).map(state => ({
    value: state,
    label: state
  }));
};

// Función para obtener ciudades de un estado
export const getCities = (country, state) => {
  if (!country || !state || !geoData[country] || !geoData[country].states[state]) return [];
  
  return geoData[country].states[state].cities.map(city => ({
    value: city,
    label: city
  }));
};

// Función para obtener código telefónico de un país
export const getPhoneCode = (country) => {
  if (!country || !geoData[country]) return '';
  return geoData[country].phoneCode;
};

// Función para validar formato de teléfono
export const validatePhone = (phone, country) => {
  if (!phone) return true; // No es obligatorio
  
  const phoneCode = getPhoneCode(country);
  const phoneWithoutCode = phone.replace(phoneCode, '');
  
  // Validación básica: solo números y longitud mínima
  const cleanPhone = phoneWithoutCode.replace(/\D/g, '');
  return cleanPhone.length >= 7;
};

// Función para validar formato de email
export const validateEmail = (email) => {
  if (!email) return true; // No es obligatorio
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
