import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  TablePagination,
  TableSortLabel,
  Checkbox,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 20,
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.4)',
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.3), transparent)',
  }
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-head': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontWeight: 800,
    fontSize: '0.8rem',
    color: '#fff',
    borderBottom: '3px solid rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: theme.spacing(3, 2),
    position: 'relative',
    '&:first-of-type': {
      borderTopLeftRadius: 20,
    },
    '&:last-of-type': {
      borderTopRightRadius: 20,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '30px',
      height: '2px',
      background: 'rgba(255,255,255,0.5)',
      borderRadius: '1px',
    }
  },
  '& .MuiTableCell-body': {
    fontSize: '0.9rem',
    borderBottom: '1px solid rgba(224, 230, 237, 0.2)',
    padding: theme.spacing(3, 2),
    color: '#2c3e50',
    fontWeight: 500,
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&:hover': {
      backgroundColor: 'rgba(78, 205, 196, 0.08)',
      transform: 'translateY(-3px) scale(1.01)',
      boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
      '& .MuiTableCell-body': {
        color: '#1a1a1a',
        fontWeight: 600,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)',
        borderRadius: '0 2px 2px 0',
      }
    },
    '&:nth-of-type(even)': {
      backgroundColor: 'rgba(255,255,255,0.4)',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(255,255,255,0.6)',
    }
  },
}));

const ModernTable = ({
  columns = [],
  data = [],
  loading = false,
  selectable = false,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  actions = [],
  pagination = true,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  sortable = true,
  sortBy = '',
  sortDirection = 'asc',
  onSort,
  ...props
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(data.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelected);
  };

           const renderCell = (column, row) => {
           const value = row[column.field];

           // Si hay una función renderCell personalizada, usarla
           if (column.renderCell) {
             const renderData = column.renderCell(value, row);
             
             switch (column.type) {
                               case 'avatar':
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={renderData.src}
                        sx={{ 
                          width: 48, 
                          height: 48,
                          bgcolor: renderData.src ? 'transparent' : '#4ecdc4',
                          border: '3px solid rgba(78, 205, 196, 0.2)',
                          boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)',
                          fontSize: '1.2rem',
                          fontWeight: 700
                        }}
                      >
                        {renderData.name ? renderData.name.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 700, 
                            color: '#2c3e50',
                            fontSize: '0.95rem',
                            lineHeight: 1.2
                          }}
                        >
                          {renderData.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#7f8c8d',
                            fontSize: '0.8rem',
                            fontWeight: 500
                          }}
                        >
                          {renderData.email}
                        </Typography>
                      </Box>
                    </Box>
                  );

                               case 'chip':
                  return (
                    <Chip
                      label={renderData.label || value}
                      size="medium"
                      sx={{
                        backgroundColor: renderData.color || column.chipColor || '#4ecdc4',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        height: 28,
                        borderRadius: 14,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '& .MuiChip-label': {
                          px: 2,
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }
                      }}
                    />
                  );

                               case 'status':
                  return (
                    <Chip
                      label={renderData.label || value}
                      size="medium"
                      sx={{
                        backgroundColor: renderData.color || '#95a5a6',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        height: 28,
                        borderRadius: 14,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '& .MuiChip-label': {
                          px: 2,
                        },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }
                      }}
                    />
                  );

               default:
                 return (
                   <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                     {renderData.label || value}
                   </Typography>
                 );
             }
           }

           // Renderizado por defecto sin función personalizada
           switch (column.type) {
             case 'avatar':
               return (
                 <Avatar
                   src={value}
                   sx={{ 
                     width: 40, 
                     height: 40,
                     bgcolor: value ? 'transparent' : '#4ecdc4'
                   }}
                 >
                   {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
                 </Avatar>
               );

             case 'chip':
               return (
                 <Chip
                   label={value}
                   size="small"
                   sx={{
                     backgroundColor: column.chipColor || '#4ecdc4',
                     color: '#fff',
                     fontWeight: 600,
                     fontSize: '0.75rem',
                     '& .MuiChip-label': {
                       px: 1,
                     }
                   }}
                 />
               );

             case 'currency':
               return (
                 <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                   ${parseFloat(value).toLocaleString()}
                 </Typography>
               );

             case 'date':
               return (
                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                   <Typography 
                     variant="body2" 
                     sx={{ 
                       color: '#2c3e50',
                       fontWeight: 600,
                       fontSize: '0.9rem'
                     }}
                   >
                     {new Date(value).toLocaleDateString('es-ES', {
                       day: 'numeric',
                       month: 'short'
                     })}
                   </Typography>
                   <Typography 
                     variant="caption" 
                     sx={{ 
                       color: '#7f8c8d',
                       fontSize: '0.75rem',
                       fontWeight: 500
                     }}
                   >
                     {new Date(value).getFullYear()}
                   </Typography>
                 </Box>
               );

             case 'status':
               const statusColors = {
                 active: '#27ae60',
                 inactive: '#e74c3c',
                 pending: '#f39c12',
                 completed: '#4ecdc4'
               };
               return (
                 <Chip
                   label={value === 'active' ? 'Activo' : value === 'inactive' ? 'Inactivo' : value}
                   size="small"
                   sx={{
                     backgroundColor: statusColors[value.toLowerCase()] || '#95a5a6',
                     color: '#fff',
                     fontWeight: 600,
                     fontSize: '0.75rem',
                     '& .MuiChip-label': {
                       px: 1,
                     }
                   }}
                 />
               );

             default:
               return (
                 <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                   {value}
                 </Typography>
               );
           }
         };

  return (
    <Box sx={{ width: '100%' }}>
      {loading && (
        <LinearProgress 
          sx={{ 
            borderRadius: '8px 8px 0 0',
            height: 4,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #4ecdc4, #45b7d1)',
            }
          }} 
        />
      )}
      
      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: '#4ecdc4',
                      '&.Mui-checked': {
                        color: '#4ecdc4',
                      },
                    }}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell key={column.field} align={column.align || 'left'}>
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === column.field}
                      direction={sortBy === column.field ? sortDirection : 'asc'}
                      onClick={() => onSort && onSort(column.field)}
                      sx={{
                        '&.MuiTableSortLabel-active': {
                          color: '#4ecdc4',
                        },
                        '& .MuiTableSortLabel-icon': {
                          color: '#4ecdc4 !important',
                        },
                      }}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
              
              {(onEdit || onDelete || onView || actions.length > 0) && (
                <TableCell align="center">Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            <AnimatePresence>
              {data.map((row, index) => (
                <motion.tr
                  key={row.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  component={TableRow}
                  hover
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.indexOf(row.id) !== -1}
                        onChange={() => handleSelectRow(row.id)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          color: '#4ecdc4',
                          '&.Mui-checked': {
                            color: '#4ecdc4',
                          },
                        }}
                      />
                    </TableCell>
                  )}
                  
                  {columns.map((column) => (
                    <TableCell key={column.field} align={column.align || 'left'}>
                      {renderCell(column, row)}
                    </TableCell>
                  ))}
                  
                                           {(onEdit || onDelete || onView || actions.length > 0) && (
                           <TableCell align="center">
                             <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                               {onView && (
                                 <Tooltip title="Ver detalles">
                                   <IconButton
                                     size="medium"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       onView(row);
                                     }}
                                     sx={{ 
                                       color: '#45b7d1',
                                       backgroundColor: 'rgba(69, 183, 209, 0.1)',
                                       '&:hover': {
                                         backgroundColor: 'rgba(69, 183, 209, 0.2)',
                                         transform: 'scale(1.1)',
                                       }
                                     }}
                                   >
                                     <VisibilityIcon />
                                   </IconButton>
                                 </Tooltip>
                               )}

                               {onEdit && (
                                 <Tooltip title="Editar">
                                   <IconButton
                                     size="medium"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       onEdit(row);
                                     }}
                                     sx={{ 
                                       color: '#f39c12',
                                       backgroundColor: 'rgba(243, 156, 18, 0.1)',
                                       '&:hover': {
                                         backgroundColor: 'rgba(243, 156, 18, 0.2)',
                                         transform: 'scale(1.1)',
                                       }
                                     }}
                                   >
                                     <EditIcon />
                                   </IconButton>
                                 </Tooltip>
                               )}

                               {onDelete && (
                                 <Tooltip title="Eliminar">
                                   <IconButton
                                     size="medium"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       onDelete(row);
                                     }}
                                     sx={{ 
                                       color: '#e74c3c',
                                       backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                       '&:hover': {
                                         backgroundColor: 'rgba(231, 76, 60, 0.2)',
                                         transform: 'scale(1.1)',
                                       }
                                     }}
                                   >
                                     <DeleteIcon />
                                   </IconButton>
                                 </Tooltip>
                               )}

                               {actions.map((action, actionIndex) => (
                                 <Tooltip key={actionIndex} title={action.tooltip}>
                                   <IconButton
                                     size="medium"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       action.onClick(row);
                                     }}
                                     sx={{ 
                                       color: action.color || '#4ecdc4',
                                       backgroundColor: `${action.color || '#4ecdc4'}20`,
                                       '&:hover': {
                                         backgroundColor: `${action.color || '#4ecdc4'}30`,
                                         transform: 'scale(1.1)',
                                       }
                                     }}
                                   >
                                     {action.icon}
                                   </IconButton>
                                 </Tooltip>
                               ))}
                             </Box>
                           </TableCell>
                         )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      
                   {pagination && (
               <Box sx={{ 
                 p: 2, 
                 background: 'rgba(255,255,255,0.8)', 
                 borderTop: '1px solid rgba(0,0,0,0.1)',
                 borderRadius: '0 0 16px 16px'
               }}>
                 <TablePagination
                   component="div"
                   count={totalCount}
                   page={page}
                   onPageChange={onPageChange}
                   rowsPerPage={rowsPerPage}
                   onRowsPerPageChange={onRowsPerPageChange}
                   rowsPerPageOptions={[5, 10, 25, 50]}
                   sx={{
                     '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                       color: '#2c3e50',
                       fontWeight: 600,
                       fontSize: '0.875rem',
                     },
                     '& .MuiTablePagination-select': {
                       color: '#4ecdc4',
                       fontWeight: 600,
                     },
                     '& .MuiTablePagination-actions': {
                       '& .MuiIconButton-root': {
                         color: '#4ecdc4',
                         '&:hover': {
                           backgroundColor: 'rgba(78, 205, 196, 0.1)',
                         },
                         '&.Mui-disabled': {
                           color: '#bdc3c7',
                         }
                       }
                     }
                   }}
                 />
               </Box>
             )}
    </Box>
  );
};

export default ModernTable; 