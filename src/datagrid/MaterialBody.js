import React from 'react'
import PropTypes from 'prop-types'
import {
  useTheme,
  makeStyles,
  Typography,
  Avatar,
  Checkbox,
  Button
} from '@material-ui/core'

import { stableSort, getSorting } from '../utils/ApplicationUtils'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  bodyWrapper: {
    width: 'auto'
  },
  bodyRow: {
    display: 'flex',
    height: '40px'
  },
  bodyCell: {
    borderBottom:
      theme.palette.type === 'dark'
        ? '0.5px solid rgb(185, 191, 203, 5%)'
        : '0.5px solid rgb(185, 191, 203, 30%)',
    padding: '0px 10px',
    display: 'flex',
    alignItems: 'center',
    maxHeight: '100%'
  },
  avater: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  },
  cellValue: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  cellCenter: {
    textAlign: 'center'
  },
  cellButton: {
    lineHeight: 'normal'
  },
  bodyRowEven: {
    backgroundColor: 'rgb(0, 0, 0, 5%)'
  },
  bodyRowOdd: {
    backgroundColor: 'rgb(0, 0, 0, 0%)'
  },
  cellValueHyperlink: {
    color: theme.palette.type === 'light' ? theme.palette.primary[500] : theme.palette.primary[200],
    fontWeight: 600,
    fontSize: '0.8rem'
  },
  cellValueNormal: {
    color: 'inherit',
    fontSize: '0.75rem'
  }
}))

function MaterialBody(props) {
  const classes = useStyles()
  const theme = useTheme()
  const {
    freezeSection,
    freezeColumnWidth,
    header,
    data,
    sorting,
    calculatedSelected,
    calculatedKeyCol,
    singleRowSelectionHandler,
    dataSelectionHandler,
    page,
    rowsPerPage,
    tableSripe
  } = props

  const isSelected = (row) => {
    const isSelectedArray =
      calculatedSelected && calculatedSelected.length > 0
        ? calculatedSelected.filter(
            (d) => d[calculatedKeyCol] === row[calculatedKeyCol]
          )
        : []
    return isSelectedArray.length > 0
  }

  const getCellData = (row, header) => {
    switch (header.dataType) {
      case 'number': {
        return (
          <div
            onClick={
              header.clickHandler && typeof header.clickHandler === 'function'
                ? () => {
                    header.clickHandler(row, header)
                  }
                : undefined
            }
            style={{ cursor: header.clickHandler ? 'pointer' : 'auto' }}
          >
            <Typography
              className={clsx(classes.cellValue, classes.cellCenter)}
              variant="body2"
              color={header.clickHandler ? 'primary' : 'inherit'}
            >
              {row[header.colId]}
            </Typography>
          </div>
        )
      }
      case 'boolean': {
        return (
          <div
            onClick={
              header.clickHandler && typeof header.clickHandler === 'function'
                ? () => {
                    header.clickHandler(row, header)
                  }
                : undefined
            }
            style={{ cursor: header.clickHandler ? 'pointer' : 'auto' }}
          >
            <Typography
              className={clsx(classes.cellValue, classes.cellCenter)}
              variant="body2"
              color={header.clickHandler ? 'primary' : 'inherit'}
            >
              {row[header.colId] ? 'Yes' : 'No'}
            </Typography>
          </div>
        )
      }
      case 'button': {
        return (
          <div className={classes.cellCenter}>
            <Button
              className={clsx(classes.cellValue, classes.cellButton)}
              size="small"
              color={header.buttonColor ? header.buttonColor : 'default'}
              variant={header.buttonVariant ? header.buttonVariant : 'outlined'}
              onClick={
                header.clickHandler && typeof header.clickHandler === 'function'
                  ? () => {
                      header.clickHandler(row, header)
                    }
                  : undefined
              }
            >
              {row[header.colId]}
            </Button>
          </div>
        )
      }
      case 'other': {
        return (
          <div
            onClick={
              header.clickHandler && typeof header.clickHandler === 'function'
                ? () => {
                    header.clickHandler(row, header)
                  }
                : undefined
            }
            style={{ cursor: header.clickHandler ? 'pointer' : 'auto' }}
          >
            {row[header.colId]}
          </div>
        )
      }
    }
  }

  return (
    <div className={classes.bodyWrapper}>
      {stableSort(data, getSorting(sorting))
        .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
        .map((row, index) => (
          <React.Fragment key={index}>
            <div className={classes.bodyRow}>
              {((freezeSection && freezeColumnWidth > 0) ||
                (!freezeSection && freezeColumnWidth === 0)) &&
                (dataSelectionHandler || calculatedSelected) && (
                  <div className={clsx(classes.bodyCell, tableSripe && index % 2 === 0 ? classes.bodyRowEven : classes.bodyRowOdd)}>
                    <Checkbox
                      style={{ padding: 0 }}
                      checked={isSelected(row)}
                      onChange={() => singleRowSelectionHandler(row)}
                      disabled={!dataSelectionHandler}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                  </div>
                )}
              {header
                .filter((h) => h.display)
                .filter((h) => h.freeze === freezeSection)
                .map((h) => (
                  <div
                    className={clsx(classes.bodyCell, tableSripe && index % 2 === 0 ? classes.bodyRowEven : classes.bodyRowOdd)}
                    style={{
                      minWidth: h.targetWidth,
                      width: h.targetWidth,
                      backgroundColor: h.backgroundColor
                        ? typeof h.backgroundColor === 'function'
                          ? h.backgroundColor(row)
                          : h.backgroundColor
                        : 'auto',
                      color: h.backgroundColor
                        ? theme.palette.getContrastText(
                            typeof h.backgroundColor === 'function'
                              ? h.backgroundColor(row)
                              : h.backgroundColor
                          )
                        : 'auto'
                    }}
                    key={h.colId}
                  >
                    {(h.avaterText || h.avaterSrc) && (
                      <div style={{ marginRight: '10px' }}>
                        <Avatar
                          alt={h.avaterText || ''}
                          src={row[`${h.colId}Avater`]}
                          className={classes.avater}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ margin: 'auto 0', width: '100%' }}>
                        {!h.dataType ||
                        h.dataType === 'string' ||
                        h.dataType === 'date' ||
                        h.dataType === 'datetime' ? (
                          <div
                            onClick={
                              h.clickHandler &&
                              typeof h.clickHandler === 'function'
                                ? () => {
                                    h.clickHandler(row, h)
                                  }
                                : undefined
                            }
                            style={{
                              cursor: h.clickHandler ? 'pointer' : 'auto'
                            }}
                          >
                            <Typography
                              className={clsx(classes.cellValue, h.clickHandler ? classes.cellValueHyperlink : classes.cellValueNormal)}
                            >
                              {row[h.colId]}
                            </Typography>
                          </div>
                        ) : (
                          <>{getCellData(row, h)}</>
                        )}
                      </div>
                      {h.icon && (
                        <div>
                          {typeof h.icon === 'function' ? (
                            <>{h.icon(row)}</>
                          ) : React.isValidElement(h.icon) ? (
                            <>{h.icon}</>
                          ) : (
                            <h.icon />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </React.Fragment>
        ))}
    </div>
  )
}

MaterialBody.propTypes = {
  tableSize: PropTypes.string.isRequired,
  freezeSection: PropTypes.bool.isRequired,
  freezeColumnWidth: PropTypes.number.isRequired,
  header: PropTypes.array.isRequired,
  data: PropTypes.array,
  sorting: PropTypes.object,
  calculatedSelected: PropTypes.any,
  calculatedKeyCol: PropTypes.string,
  singleRowSelectionHandler: PropTypes.func.isRequired,
  dataSelectionHandler: PropTypes.func
}

export default React.memo(MaterialBody)
