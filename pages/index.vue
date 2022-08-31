<template>
  <div>
    <v-text-field v-model="search"> </v-text-field>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      class="elevation-1"
      @update:options="paginate"
      :server-items-length="count"
      single-select
      :footer-props="{
        'items-per-page-options': [10, 10],
        'show-current-page': true,
        'show-first-last-page': true,
        'page-text': 'رقم الصفحة',
        'items-per-page-text': 'عدد الأسطر',
      }"
    ></v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import axios from "axios";
import { count } from "console";
import { watch } from "vue";

@Component({ components: {} })
export default class Index extends Vue {
  name = "IndexPage";
  headers = [
    { text: "الاسم", value: "title" },
    { text: "الوصف", value: "description" },
  ];
  items = [];
  count = 0;
  page = 1;

  search = "";
  async getData() {
    this.count = 0;
    this.items = [];
    let res = await (
      await axios.get(
        "http://localhost:3000/api/places?skip=" +
          this.page +
          "&search=" +
          this.search
      )
    ).data;
    this.items = res["data"];
    console.log(res["count"]);
    this.count = res["count"];
  }
  created() {
    this.getData();
  }
  @Watch("search")
  onSearch() {
    this.getData();
  }
  @Watch("page")
  onPage() {
    this.getData();
  }
  paginate(obj: any) {
    this.page = obj.page;
    this.getData();
  }
}
</script>
