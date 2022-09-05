<template>
  <div>
    <v-text-field v-model="search"> </v-text-field>
    <div v-resize="onResize">
      <v-data-table
        :headers="headers"
        :items="items"
        class="tab10"
        :items-per-page="1"
        @update:options="paginate"
        :server-items-length="count"
        :height="windowSize.y - 270"
        single-select
      >
        <template v-slot:[`item.title`]="{ index, item }">
          <span v-if="index !== items.length - 1">{{ item.title }}</span>
          <span v-else v-intersect="onIntersect">{{ item.title }}</span>
        </template>
      </v-data-table>
    </div>
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
  windowSize = { x: 0, y: 0 };
  search = "";
  async getData() {
    // this.count = 0;
    // this.items = [];
    if (this.items.length != 0 && this.count == this.items.length) {
      return;
    }
    let res = await (
      await axios.get(
        "http://localhost:3000/api/places?skip=" +
          this.page +
          "&search=" +
          this.search
      )
    ).data;

    this.items.push(...res["data"]);

    this.count = res["count"];
  }
  created() {}
  @Watch("search")
  onSearch() {
    this.page = 1;
    this.items = [];

    this.getData();
  }
  onIntersect(e) {
    if (e[0].isIntersecting) {
      this.page++;
    }
  }
  @Watch("page")
  onPage() {
    this.getData();
  }

  onResize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    console.log(this.windowSize);
  }

  paginate(obj: any) {
    this.page = obj.page;
    this.getData();
  }
}
</script>
