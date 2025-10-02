import React from "react";
import { SearchBar } from "../components/molecules/SearchBar";
import { ItemsTable } from "../components/organisms/ItemsTable";
import { ItemsPageTemplate } from "../components/templates/ItemsPageTemplate";

function Items() {
  return (
    <ItemsPageTemplate
      searchBar={<SearchBar />}
      tableControls={null}
      itemsTable={<ItemsTable />}
    />
  );
}

export default Items;
