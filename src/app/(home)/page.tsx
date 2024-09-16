"use client";

import styles from "./styles.module.scss";
import { Cell, ExtendedData, Row, Table } from "@/components/Table/Table";
import { useEffect, useState } from "react";
import { apiUserGetSome } from "../api/user/get/some/route";

type DataAddres = (ExtendedData & {
  id: string;
  city: string;
  geo: (ExtendedData & { lat: string; lng: string; isVisible: boolean })[];
  street: string;
  suite: string;
  zipcode: string;
  isVisible: boolean;
})[];

type Data = (ExtendedData & {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  isVisible: boolean;
  address: DataAddres;
})[];

const HomePage = () => {
  const [data, setData] = useState<Data>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await apiUserGetSome();

      if (response.status !== "ERROR" && response.data) {
        setData(
          response.data.map(({ id, name, email, phone, address, username }) => {
            return {
              id: id,
              name: name,
              email: email,
              phone: phone,
              username: username,
              address: [address].map((data, index) => {
                return {
                  ...data,
                  id: `${index}`,
                  isSelected: false,
                  isEdited: null,
                  isVisible: true,
                  geo: [address.geo].map((data, index) => {
                    return {
                      ...data,
                      id: `${index}`,
                      isSelected: false,
                      isEdited: null,
                      isVisible: true,
                    };
                  }),
                };
              }),
              isEdited: null,
              isSelected: false,
              isVisible: true,
            };
          })
        );
      }

      setIsLoading(false);
    })();
  }, []);

  return (
    <div className={`${styles.homePage}`}>
      <header>
        <p>
          Welcome to my solve of recruitment task to <i>Smart IT</i>. It took me the whole week to create this table, but I think it has potential :D
        </p>
        <p>
          The cool part of this table is, it can has (probably) infinite <i>relation</i> fields which are editable and reactive with initial state
        </p>
        <p>It works due to nested another Table in cell fields (and other tricks under the hood)</p>
        <p>It is not fully done yet so some part cant works (like saveing or deleting buttons)</p>
        <p>Enjoy!</p>
      </header>
      {/* It can be hard to read so good practice is to split it all apart /}
      {/* If some heading is not specifed, it wil not display in a table*/}
      <Table
        headers={[
          {
            objectProperty: "isSelected",
            displayName: "",
          },
          {
            objectProperty: "id",
            displayName: "Id",
          },
          {
            objectProperty: "name",
            displayName: "Name",
          },
          {
            objectProperty: "username",
            displayName: "Username",
          },
          {
            objectProperty: "email",
            displayName: "Email",
          },
          {
            objectProperty: "phone",
            displayName: "Phone",
          },
          {
            objectProperty: "address",
            displayName: "Address",
          },
        ]}
        isLoading={isLoading}
        setData={setData}
        onSearch={(event) => {
          const { value, objectProperty } = event;

          setData((currentValue) => {
            const copiedCurrentValue = [...currentValue];

            copiedCurrentValue.forEach((data) => {
              const valueLocal = data[objectProperty as keyof typeof data];

              const doesValueMatch = valueLocal && valueLocal.toString().includes(value);

              if (doesValueMatch) {
                data.isVisible = true;
              } else {
                data.isVisible = false;
              }
            });

            return copiedCurrentValue;
          });
        }}>
        {data.map((data) => {
          if (data.isVisible) {
            return (
              <Row key={data.id} id={data.id}>
                {Object.entries(data).map(([key, value]) => {
                  return (
                    <Cell key={key} objectProperty={key} isEditable={key === "id" ? false : true} dataType={key === "address" ? "relation" : undefined}>
                      {key !== "address" ? (
                        value
                      ) : (
                        <Table
                          headers={[
                            {
                              objectProperty: "city",
                              displayName: "City",
                            },
                            {
                              objectProperty: "street",
                              displayName: "Street",
                            },
                            {
                              objectProperty: "suite",
                              displayName: "Suite",
                            },
                            {
                              objectProperty: "zipcode",
                              displayName: "Zipcode",
                            },
                            {
                              objectProperty: "geo",
                              displayName: "Geo",
                            },
                          ]}
                          setData={setData}
                          onSearch={(event) => {
                            const { value, objectProperty } = event;

                            setData((currentValue) => {
                              const copiedCurrentValue = [...currentValue];

                              copiedCurrentValue.forEach((data) => {
                                const valueLocal = data[objectProperty as keyof typeof data];

                                const doesValueMatch = valueLocal && valueLocal.toString().includes(value);

                                if (doesValueMatch) {
                                  data.isVisible = true;
                                } else {
                                  data.isVisible = false;
                                }
                              });

                              return copiedCurrentValue;
                            });
                          }}>
                          {(value as DataAddres).map((data) => {
                            return (
                              <Row key={data.id} id={data.id}>
                                {Object.entries(data).map(([key, value]) => {
                                  return (
                                    <Cell
                                      key={key}
                                      objectProperty={key}
                                      isEditable={key === "id" ? false : true}
                                      dataType={key === "geo" ? "relation" : undefined}>
                                      {key !== "geo" ? (
                                        value
                                      ) : (
                                        <Table
                                          headers={[
                                            {
                                              objectProperty: "lat",
                                              displayName: "Lat",
                                            },
                                            {
                                              objectProperty: "lng",
                                              displayName: "Lng",
                                            },
                                          ]}
                                          setData={setData}
                                          onSearch={(event) => {
                                            const { value, objectProperty } = event;

                                            setData((currentValue) => {
                                              const copiedCurrentValue = [...currentValue];

                                              copiedCurrentValue.forEach((data) => {
                                                const valueLocal = data[objectProperty as keyof typeof data];

                                                const doesValueMatch = valueLocal && valueLocal.toString().includes(value);

                                                if (doesValueMatch) {
                                                  data.isVisible = true;
                                                } else {
                                                  data.isVisible = false;
                                                }
                                              });

                                              return copiedCurrentValue;
                                            });
                                          }}>
                                          {(value as DataAddres).map((data) => {
                                            return (
                                              <Row key={data.id} id={data.id}>
                                                {Object.entries(data).map(([key, value]) => {
                                                  return (
                                                    <Cell
                                                      key={key}
                                                      objectProperty={key}
                                                      isEditable={key === "id" ? false : true}
                                                      dataType={key === "geo" ? "relation" : undefined}>
                                                      {value as string}
                                                    </Cell>
                                                  );
                                                })}
                                              </Row>
                                            );
                                          })}
                                        </Table>
                                      )}
                                    </Cell>
                                  );
                                })}
                              </Row>
                            );
                          })}
                        </Table>
                      )}
                    </Cell>
                  );
                })}
              </Row>
            );
          }
        })}
      </Table>
    </div>
  );
};

export default HomePage;
