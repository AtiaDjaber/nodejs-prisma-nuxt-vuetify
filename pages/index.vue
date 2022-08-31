<template>
  <div>
    <v-btn color="red" @click="getData()"> send </v-btn>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios from "axios";

@Component({ components: {} })
export default class Index extends Vue {
  name = "IndexPage";

  async getData() {
    let data = await axios.get("http://127.0.0.1:8000/api/notifications");
    console.log(data.data);
  }
  created() {
    // this.getData();
  }
}
</script>
