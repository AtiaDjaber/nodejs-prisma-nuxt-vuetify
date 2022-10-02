<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          hide-spin-buttons
          solo
          style="border-radius: 10px"
          placeholder="مربع البحث ..."
          clearable
          hint="البحث بالاسم و اللقب"
          flat
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-autocomplete
          v-model="search"
          hide-spin-buttons
          solo
          item-text="title"
          :items="items"
          style="border-radius: 10px"
          placeholder="مربع البحث ..."
          clearable
          hint="البحث بالاسم و اللقب"
          flat
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-row no-gutters class="pa-1" style="background-color: white">
          <v-col
            v-for="item in items"
            v-bind:key="item.id"
            class="pa-1"
            cols="2"
          >
            <v-btn elevation="0" block color="primary">{{ item.id }}</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div v-resize="onResize">
      <v-data-table
        :headers="headers"
        :items="items"
        class="tab10"
        :items-per-page="1"
        :server-items-length="count"
        :height="windowSize.y - 255"
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
    if (this.search == null) {
      this.search = "";
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
  created() {
    this.getData();
  }
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

  // paginate(obj: any) {
  //   this.page = obj.page;
  //   this.getData();
  // }
}
</script>
