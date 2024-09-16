"use client";

import React, {
  Children,
  cloneElement,
  createContext,
  Dispatch,
  isValidElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./styles.module.scss";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useSignals } from "@preact/signals-react/runtime";
import DataPicker from "./DataPicker/DataPicker";

const PlusJakartaSansFont = Plus_Jakarta_Sans({ weight: ["400", "500"], subsets: ["latin"] });

const saveValueToTable = (
  dataType: CellDataType,
  type: Celltype,
  objectProperty: string,
  value: string,
  setCellValue: Dispatch<React.SetStateAction<string | number | boolean | any[] | JSX.Element | Date | null>>
) => {
  if (dataType !== "date" && type !== "searcher" && objectProperty !== "isSelected" && dataType !== "relation") {
    if (value == "true") {
      setCellValue(true);
    } else if (value == "false") {
      setCellValue(false);
    } else {
      setCellValue(value);
    }
  }
};

const arrayIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4b5a68">
      <path d="M600-160v-80h120v-480H600v-80h200v640H600Zm-440 0v-640h200v80H240v480h120v80H160Z" />
    </svg>
  );
};

const RightIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="#4b5a68">
      <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
    </svg>
  );
};

const LeftIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="#4b5a68">
      <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
    </svg>
  );
};

const searchIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#4b5a68">
      <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
    </svg>
  );
};

const addIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4b5a68">
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  );
};

const trashIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4b5a68">
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  );
};

const saveIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4b5a68">
      <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
    </svg>
  );
};

const checkIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
    </svg>
  );
};

const SetDataContext = createContext<null | Dispatch<SetStateAction<unknown & ExtendedData[]>>>(null);
const InitialDataContext = createContext<ExtendedData[]>([]);
const SetSortingContext = createContext<Dispatch<
  SetStateAction<{
    mode: string;
    headerObjectProperty: string;
  }>
> | null>(null);
const SetResizingColumnContext = createContext<Dispatch<
  SetStateAction<{
    column: null | number;
    initialWidth: null | number;
    cursorPositionStart: { x: number; y: number } | null;
  }>
> | null>(null);

interface CheckboxProps {
  onToggle: (isChecked: boolean) => void;
  defaultValue?: boolean;
}

const Checkbox = ({ onToggle, defaultValue = false }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(defaultValue);

  return (
    <div
      className={`${styles.checkbox} ${isChecked ? styles.checked : ""}`}
      onClick={() => {
        setIsChecked((currentValue) => (currentValue === false ? true : false));

        onToggle(isChecked === false ? true : false);
      }}>
      <div className={`${styles.icon}`}>{checkIcon()}</div>
    </div>
  );
};

type CellDataType = "string" | "date" | "relation" | undefined;
type Celltype = "header" | "basic" | "searcher" | undefined;

interface CellProps {
  children: string | number | Date | boolean | JSX.Element | null | any[];
  objectProperty: string;
  isEditable?: boolean;
  rowId?: string | number;
  type?: "header" | "basic" | "searcher";
  dataType?: CellDataType;
  column?: number;
  row?: number;
  onSearch?: (value: string, objectProperty: string) => void;
  setRealtionData?: Dispatch<
    SetStateAction<{
      table: JSX.Element;
      objectProperty: string;
    } | null>
  >;
}

const Cell = ({
  children,
  type = "basic",
  column,
  row,
  dataType = "string",
  objectProperty,
  rowId,
  isEditable = true,
  onSearch,
  setRealtionData,
}: CellProps) => {
  const setData = useContext(SetDataContext);
  const initialData = useContext(InitialDataContext);
  const setSortingBy = useContext(SetSortingContext);
  const setResizingColumn = useContext(SetResizingColumnContext);

  const [cellValue, setCellValue] = useState(dataType !== "relation" ? structuredClone(children) : children);

  const cellElementRef = useRef<null | HTMLDivElement>(null);
  const initalCellValueRef = useRef<typeof children | undefined>(undefined);

  useEffect(() => {
    if (initialData.length !== 0) {
      const rowData = initialData.find((data) => data.id === rowId);

      if (rowData) {
        const initialCellValue = rowData[objectProperty as keyof typeof rowData];

        if (Array.isArray(initialCellValue) === false) {
          initalCellValueRef.current = initialCellValue;
        }
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (setData && dataType !== "relation") {
      setData((currentValue) => {
        const copiedCurrentValue = [...currentValue];

        const foundData = copiedCurrentValue.find((data) => data.id === rowId);

        if (foundData) {
          //@ts-expect-error this shouldnt give an error (otherwise the provided object property does not exist)
          foundData[objectProperty as keyof typeof foundData] = cellValue;
        }

        return copiedCurrentValue;
      });
    }
  }, [cellValue]);

  return (
    <div
      className={`${styles.cell} ${`${initalCellValueRef.current}` != `${cellValue}` && initalCellValueRef.current !== undefined ? styles.edited : ""} ${
        objectProperty === "isSelected" ? styles.isSelected : ""
      }`}
      ref={cellElementRef}
      role="cell"
      data-column={`${column}`}
      data-row={`${row}`}
      onClick={(event) => {
        const thisElement = event.currentTarget as HTMLDivElement;

        if (dataType === "relation") {
          setRealtionData &&
            setRealtionData((currentValue) => {
              if (currentValue === null) {
                return {
                  table: children as JSX.Element,
                  objectProperty: objectProperty,
                };
              } else {
                return null;
              }
            });
        }

        if (type !== "searcher") {
          (thisElement.firstChild as HTMLDivElement).focus();
        }

        if (type === "header" && setSortingBy) {
          setSortingBy((currentValue) => {
            const copiedCurrentValue = { ...currentValue };

            copiedCurrentValue.headerObjectProperty = objectProperty;
            copiedCurrentValue.mode = copiedCurrentValue.mode === "asc" ? "desc" : "asc";

            return copiedCurrentValue;
          });
        }
      }}>
      <div
        className={`${styles.cellContent}`}
        contentEditable={
          type === "header" || dataType === "date" || objectProperty === "isSelected" || type === "searcher" || dataType === "relation" || isEditable === false
            ? false
            : true
        }
        suppressContentEditableWarning={true}
        spellCheck={false}
        tabIndex={type === "basic" ? 1 : -1}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onBlur={async (event) => {
          const thisElement = event.currentTarget as HTMLDivElement;

          saveValueToTable(dataType, type, objectProperty, thisElement.innerText, setCellValue);

          thisElement.scrollLeft = 0;
        }}
        onKeyDown={(event) => {
          const thisElement = event.currentTarget as HTMLDivElement;
          if (event.key === "Enter") {
            saveValueToTable(dataType, type, objectProperty, thisElement.innerText, setCellValue);
          }
        }}>
        {(() => {
          if (objectProperty === "isSelected" && type !== "header" && type !== "searcher") {
            return (
              <Checkbox
                defaultValue={children as boolean}
                onToggle={(value) => {
                  if (setData) {
                    setData((currentValue) => {
                      const copiedCurrentValue = [...currentValue];

                      const foundData = copiedCurrentValue.find((data) => data.id === rowId)!;

                      foundData.isSelected = value;

                      return copiedCurrentValue;
                    });
                  }
                }}></Checkbox>
            );
          } else if (dataType === "date") {
            return new Date(`${children}`).toLocaleDateString(undefined, {
              hour: "numeric",
              minute: "numeric",
              month: "long",
              year: "numeric",
              day: "numeric",
            });
          } else if (type === "searcher" && objectProperty !== "isSelected") {
            return (
              <input
                onInput={(event) => {
                  const thisElement = event.currentTarget as HTMLInputElement;

                  onSearch && onSearch(thisElement.value, objectProperty);
                }}></input>
            );
          } else if (dataType === "relation") {
            return <div className={`${styles.icon}`}>{arrayIcon()}</div>;
          } else {
            return `${children}`;
          }
        })()}
      </div>
      {type === "header" && (
        <div
          className={`${styles.resizer}`}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            if (cellElementRef.current && column !== undefined && setResizingColumn) {
              const { width } = cellElementRef.current.getBoundingClientRect();

              setResizingColumn({
                column: column,
                initialWidth: width,
                cursorPositionStart: {
                  x: event.clientX,
                  y: event.clientY,
                },
              });
            }
          }}></div>
      )}
      {dataType === "date" && document.activeElement === cellElementRef.current?.firstChild && (
        <div
          className={`${styles.datePicker}`}
          onMouseDown={(event) => {
            event.preventDefault();
          }}>
          <DataPicker
            initialDate={new Date(`${children}`)}
            type={"date-time"}
            style={{
              backgrondColor: "white",
              fontColor: "#4b5a68",
              hoverColor: "#ecf1f8",
              borderColor: "transparent",
              componentBorderRadius: "0px",
            }}
            onSave={(date) => {
              setCellValue(date);
            }}></DataPicker>
        </div>
      )}
    </div>
  );
};

export { Cell };

interface RowProps {
  children: JSX.Element | JSX.Element[];
  id: string | number;
  headers?: Headers;
  row?: number;
  tableElement?: HTMLDivElement | null;
}

const Row = ({ children, row, headers, id, tableElement }: RowProps) => {
  useSignals();

  const initialData = useContext(InitialDataContext);

  const initialSetData = useContext(SetDataContext);

  const [isVisible, setIsVisible] = useState(true);
  const [realtionData, setRealtionData] = useState<{
    table: JSX.Element;
    objectProperty: string;
  } | null>(null);
  const [data, setData] = useState<any[]>([]);

  const observerRef = useRef<null | IntersectionObserver>(null);
  const rowWrapperElementRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (initialSetData && realtionData) {
      initialSetData((currentValue) => {
        const copiedCurrentValue = [...currentValue];

        const foundData = copiedCurrentValue.find((data) => data.id === id);

        if (foundData) {
          (foundData[realtionData.objectProperty as keyof typeof foundData] as unknown as any[]) = data;
        }

        return copiedCurrentValue;
      });
    }
  }, [data]);

  useEffect(() => {
    if (realtionData !== null) {
      (async () => {
        const localData = await new Promise<any[]>((resolve) => {
          if (initialSetData && realtionData) {
            initialSetData((currentValue) => {
              const foundData = currentValue.find((data) => data.id === id);

              if (foundData) {
                resolve(foundData[realtionData.objectProperty as keyof typeof foundData] as unknown as any[]);
              }

              return currentValue;
            });
          }
        });

        setData(structuredClone(localData));
      })();
    }
  }, [realtionData]);

  useEffect(() => {
    if (observerRef.current === null && rowWrapperElementRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ isIntersecting }) => {
            // It hides cells that are not visible in viewport. It reduce lag while resizing column

            if (id !== "header") {
              setIsVisible(isIntersecting);
            }

            if (isIntersecting === false) {
              setRealtionData(null);
            }
          });
        },
        {
          rootMargin: "0px",
          threshold: 0,
        }
      );

      observerRef.current.observe(rowWrapperElementRef.current);

      return () => {
        observerRef.current!.disconnect();
        observerRef.current = null;
      };
    }
  }, []);

  useLayoutEffect(() => {
    if (isVisible && rowWrapperElementRef.current && headers && tableElement) {
      const headerRowCellElements = [...tableElement.querySelectorAll(`[data-row="-2"]`)] as HTMLDivElement[];
      const currentRowCellElements = [...(rowWrapperElementRef.current.firstChild as HTMLDivElement).children] as HTMLDivElement[];

      currentRowCellElements.forEach((element, index) => {
        element.style.width = headerRowCellElements[index]?.style.width;
      });
    }
  }, [isVisible]);

  const childrenLocal = Children.toArray(children);

  const sortedChildren = (() => {
    const sortedChildren: Array<Exclude<ReactNode, boolean | null | undefined>> = [];

    headers!.forEach((header) => {
      const headerObjectProperty = header.objectProperty;

      const foundCellElement = childrenLocal.find((element) => {
        const cellObjectProperty = React.isValidElement(element) ? (element.props.objectProperty as string) : (null as never);

        return cellObjectProperty === headerObjectProperty;
      });

      if (foundCellElement) {
        sortedChildren.push(foundCellElement);
      }
    });

    return sortedChildren;
  })();

  const isRowSelected = (
    childrenLocal.find((element) => {
      return React.isValidElement(element) && element.props.objectProperty === "isSelected";
    }) as React.ReactElement | undefined
  )?.props.children as boolean | undefined;

  return (
    <div
      className={`${styles.rowWrapper} ${isVisible === false ? styles.hidden : ""} ${isRowSelected ? styles.selected : ""} ${
        id === "header" ? styles.header : ""
      } ${id === "searcher" ? styles.searcher : ""}`}
      ref={rowWrapperElementRef}>
      <div className={`${styles.row}`} role="row">
        {/* It doesn't allow to render any cell until row becomes visible. This is due to performance issue while resizing column. This method provides not lag (testet in 2000 rows) */}
        {isVisible &&
          sortedChildren.map((element, index) => {
            if (isValidElement(element)) {
              return (
                <React.Fragment key={element.key}>
                  {cloneElement(element as JSX.Element, {
                    column: index,
                    row: row,
                    rowId: id,
                    setRealtionData: setRealtionData,
                  })}
                </React.Fragment>
              );
            }
          })}
      </div>
      {isVisible && realtionData !== null && (
        <div className={`${styles.relationTable}`}>
          {(() => {
            const initialDataBefore = (() => {
              if (initialData.length !== 0 && realtionData) {
                const foundData = initialData.find((data) => data.id === id);

                if (foundData) {
                  const localData = foundData[realtionData.objectProperty as keyof typeof foundData] as unknown as any[];

                  return localData;
                }
              }
            })();

            return cloneElement(realtionData.table, {
              initialData: initialDataBefore,
              setData: setData,
            });
          })()}
        </div>
      )}
    </div>
  );
};

export { Row };

type Headers = { objectProperty: string; displayName: string }[];
type ExtendedData = { isEdited: null | any[]; isSelected: boolean; id: string | number };

export type { Headers, ExtendedData };

interface TableProps<Data> {
  children: (JSX.Element | undefined)[];
  headers: Headers;
  setData: Dispatch<SetStateAction<Data[]>>;
  isLoading?: boolean;
  initialData?: Data[];
  loadingText?: string;
  onSearch?: (event: { value: string; objectProperty: string }) => void;
}

const Table = <Data,>({
  children,
  headers,
  loadingText = "Loading",
  setData,
  onSearch,
  initialData: initialDataBefore,
  isLoading: isLoadingBefore = false,
}: TableProps<Data & ExtendedData>) => {
  useSignals();

  const [isLoading, setIsLoading] = useState(true);
  const [isSearchRowOpen, setIsSearchRowOpen] = useState(false);
  const [initialData, setInitialData] = useState<ExtendedData[]>(initialDataBefore ? initialDataBefore : []);
  const [sortingBy, setSortingBy] = useState({ mode: "asc", headerObjectProperty: "" });
  const [resizingColumn, setResizingColumn] = useState<{
    column: null | number;
    initialWidth: null | number;
    cursorPositionStart: { x: number; y: number } | null;
  }>({
    column: null,
    initialWidth: null,
    cursorPositionStart: null,
  });

  const tableElementRef = useRef<HTMLDivElement | null>(null);

  const childrenLocal = Children.toArray(children).filter((child) => child !== undefined);

  useEffect(() => {
    if (initialData.length === 0) {
      (async () => {
        const initialData = await new Promise<ExtendedData[]>((resolve) => {
          setData((currentValue) => {
            resolve(structuredClone(currentValue));

            return currentValue;
          });
        });

        setInitialData(initialData);
      })();
    }
  }, [isLoadingBefore]);

  useEffect(() => {
    if (tableElementRef.current) {
      const allCellsElementByColumn = [...tableElementRef.current.querySelectorAll(`[data-column]`)] as HTMLDivElement[];
      const scrollbarWidth = 16; // From styles
      const isSelectedColumnWidth = 40; // From styles

      const hasHeadersIsSelectedObjectProperty = headers.some(({ objectProperty }) => objectProperty === "isSelected");
      const averageCellWidth = (() => {
        if (hasHeadersIsSelectedObjectProperty) {
          return (tableElementRef.current!.clientWidth - scrollbarWidth) / (headers.length - 1) - isSelectedColumnWidth / (headers.length - 1);
        } else {
          return (tableElementRef.current!.clientWidth - scrollbarWidth) / headers.length;
        }
      })();

      allCellsElementByColumn.forEach((element) => {
        element.style.width = `${averageCellWidth}px`;
      });

      setIsLoading(false);
    }
  }, [isLoadingBefore]);

  useEffect(() => {
    const mousemove = (event: MouseEvent) => {
      const { column, cursorPositionStart, initialWidth } = resizingColumn;

      if (column !== undefined && cursorPositionStart && initialWidth && tableElementRef.current) {
        const allCellsElementByColumn = [
          ...tableElementRef.current.querySelectorAll(`:scope > .${styles.tableContent} > .${styles.rowWrapper} > .${styles.row} [data-column="${column}"]`),
        ] as HTMLDivElement[];

        const cursorDifferenceX = event.clientX - cursorPositionStart.x;
        const newColumnWidth = Math.round(initialWidth + cursorDifferenceX);

        allCellsElementByColumn.forEach((element) => {
          element.style.width = `${newColumnWidth}px`;
        });
      }
    };

    window.addEventListener("mousemove", mousemove);

    const mouseup = () => {
      setResizingColumn({
        column: null,
        initialWidth: null,
        cursorPositionStart: null,
      });
    };

    window.addEventListener("mouseup", mouseup);

    return () => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
    };
  }, [resizingColumn]);

  useEffect(() => {
    const headerObjectProperty = headers.find((data) => data.objectProperty === sortingBy.headerObjectProperty)?.objectProperty;

    if (headerObjectProperty) {
      const { mode } = sortingBy;

      setData((currentValue) => {
        const copiedCurrentValue = [...currentValue];

        copiedCurrentValue.sort((a, b) =>
          a[headerObjectProperty as keyof typeof a] > b[headerObjectProperty as keyof typeof b]
            ? mode === "asc"
              ? 1
              : -1
            : b[headerObjectProperty as keyof typeof b] > a[headerObjectProperty as keyof typeof a]
            ? mode === "desc"
              ? 1
              : -1
            : 0
        );

        return copiedCurrentValue;
      });
    }
  }, [sortingBy]);

  return (
    <SetResizingColumnContext.Provider value={setResizingColumn}>
      <SetSortingContext.Provider value={setSortingBy}>
        <InitialDataContext.Provider value={initialData}>
          <SetDataContext.Provider value={setData as Dispatch<SetStateAction<ExtendedData[]>>}>
            <div
              className={`${styles.table} ${PlusJakartaSansFont.className} ${resizingColumn.column === null ? "" : styles.resizing} ${
                isLoading || isLoadingBefore ? styles.loading : ""
              } ${isSearchRowOpen ? styles.searcherOpen : ""}`}
              role="table"
              ref={tableElementRef}>
              <p className={`${styles.loading}`}>{loadingText}</p>
              {isLoadingBefore === false && (
                <div className={`${styles.tableContent}`}>
                  <Row headers={headers} id={"header"} tableElement={tableElementRef.current} row={-2}>
                    {headers.map(({ displayName, objectProperty }, index) => {
                      return (
                        <Cell key={objectProperty} objectProperty={objectProperty} type="header" column={index} row={-2}>
                          {displayName}
                        </Cell>
                      );
                    })}
                  </Row>
                  <Row headers={headers} id={"searcher"} tableElement={tableElementRef.current} row={-1}>
                    {headers.map(({ displayName, objectProperty }, index) => {
                      return (
                        <Cell
                          key={objectProperty}
                          objectProperty={objectProperty}
                          type="searcher"
                          column={index}
                          row={-1}
                          onSearch={(value: string, objectProperty: string) => onSearch && onSearch({ value: value, objectProperty: objectProperty })}>
                          {displayName}
                        </Cell>
                      );
                    })}
                  </Row>
                  {childrenLocal.map((element, index) => {
                    return cloneElement(element as JSX.Element, {
                      row: index,
                      headers: headers,
                      tableElement: tableElementRef.current,
                    });
                  })}
                  <div className={`${styles.menu}`}>
                    <button>{saveIcon()}</button>
                    <button
                      onClick={() => {
                        setIsSearchRowOpen((currentValue) => (currentValue === false ? true : false));
                      }}>
                      {searchIcon()}
                    </button>
                    <button>{addIcon()}</button>
                    <button>{trashIcon()}</button>
                  </div>
                </div>
              )}
            </div>
          </SetDataContext.Provider>
        </InitialDataContext.Provider>
      </SetSortingContext.Provider>
    </SetResizingColumnContext.Provider>
  );
};

export { Table };
