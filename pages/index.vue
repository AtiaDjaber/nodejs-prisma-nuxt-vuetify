<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      class="elevation-1"
      :server-items-length="count"
    ></v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios from "axios";
import { count } from "console";

@Component({ components: {} })
export default class Index extends Vue {
  name = "IndexPage";
  headers = [
    { text: "الاسم", value: "title" },
    { text: "الوصف", value: "description" },
  ];
  items = [];
  count = 0;
  async getData() {
    let res = await (
      await axios.get("http://localhost:3000/api/user?title=grill")
    ).data;
    this.items = res["data"];
    console.log(res["count"]);
    this.count = res["count"];
  }
  created() {
    this.getData();
  }
}
</script>
