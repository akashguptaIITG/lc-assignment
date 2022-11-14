import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { convertToFilterFormat } from "./helper";

function App() {
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOptions, setFiltersOptions] = useState({
    slug: [],
    b_name: [],
    vb_name: [],
  });
  const [selectedOptions, setSelectedOptions] = useState({
    slug: [],
    b_name: [],
    vb_name: [],
  });

  useEffect(() => {
    handleDataFetch();
  }, []);
  // updating table data

  const handleDataFetch = async () => {
    const { data } = await axios.get(
      "https://us-central1-arboreal-vision-339901.cloudfunctions.net/get_filter_values"
    );
    const resultData = data.data;
    extractFilterOptionsFromTableData(resultData, "", true);
    setTableData(resultData);
    setFilteredTableData(resultData);
    setIsLoading(false);
  };
  const updateFilteredTableData = (selectedOptions, filterName) => {
    const filteredTableData = tableData
      .filter((td) => {
        if (selectedOptions.slug.length > 0) {
          console.log(selectedOptions.slug.some((s) => td.slug == s.label));
          return selectedOptions.slug.some((s) => td.slug == s.label);
        } else {
          return true;
        }
      })
      .filter((td) => {
        if (selectedOptions.b_name.length > 0) {
          return selectedOptions.b_name.some((s) => td.b_name === s.label);
        } else {
          return true;
        }
      })
      .filter((td) => {
        if (selectedOptions.vb_name.length > 0) {
          return selectedOptions.vb_name.some((s) => td.vb_name === s.label);
        } else {
          return true;
        }
      });
    console.log(filteredTableData, tableData, selectedOptions);
    setFilteredTableData(filteredTableData);
    extractFilterOptionsFromTableData(filteredTableData, filterName, false);
  };

  const extractFilterOptionsFromTableData = (
    tableData = [],
    excludeFilterName = "",
    isInitial
  ) => {
    const slugData = {};
    const b_nameData = {};
    const vb_nameData = {};
    tableData.forEach((td) => {
      slugData[td["slug"]] = 1;
      b_nameData[td["b_name"]] = 1;
      vb_nameData[td["vb_name"]] = 1;
    });

    const slugFilterArr =
      excludeFilterName === "slug"
        ? filtersOptions["slug"]
        : Object.keys(slugData).map(convertToFilterFormat);
    const b_nameFilterArr =
      excludeFilterName === "b_name"
        ? filtersOptions["b_name"]
        : Object.keys(b_nameData).map(convertToFilterFormat);
    const vb_nameFilterArr =
      excludeFilterName === "vb_name"
        ? filtersOptions["vb_name"]
        : Object.keys(vb_nameData).map(convertToFilterFormat);

    setFiltersOptions({
      slug: slugFilterArr,
      b_name: b_nameFilterArr,
      vb_name: vb_nameFilterArr,
    });
    if (isInitial) {
      setSelectedOptions({
        slug: slugFilterArr,
        b_name: b_nameFilterArr,
        vb_name: vb_nameFilterArr,
      });
    }
  };

  const handleFilterSelection = (selectedItems, filterName) => {
    let newSelectedOptions = {
      ...selectedOptions,
      [filterName]: selectedItems,
    };
    setSelectedOptions(newSelectedOptions);
    updateFilteredTableData(newSelectedOptions, filterName);
  };
  if (isLoading) return <h2>Loading....</h2>;

  return (
    <div className="app">
      <header>
        <div className="search-filters">
          <MultiSelect
            options={filtersOptions.slug}
            labelledBy="slug"
            onChange={(e) => handleFilterSelection(e, "slug")}
            value={selectedOptions.slug}
          />
          <MultiSelect
            options={filtersOptions.b_name}
            labelledBy="b_name"
            onChange={(e) => handleFilterSelection(e, "b_name")}
            value={selectedOptions.b_name}
          />
          <MultiSelect
            options={filtersOptions.vb_name}
            labelledBy="vb_name"
            onChange={(e) => handleFilterSelection(e, "vb_name")}
            value={selectedOptions.vb_name}
          />
        </div>
      </header>
      <main>
        <table>
          <thead>
            <tr>
              <th>slug</th>
              <th>b_name</th>
              <th>vb_name</th>
            </tr>
          </thead>
          <tbody>
            {filteredTableData.map((td, index) => {
              return (
                <tr key={index}>
                  <td>{td["slug"]}</td>
                  <td>{td["b_name"]}</td>
                  <td>{td["vb_name"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;
