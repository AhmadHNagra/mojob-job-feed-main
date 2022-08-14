<template>
  <div class="job-feed">
    <treeselect
      v-model="value"
      :multiple="true"
      :options="options"
      placeholder="Filter By Position"
      @input="$emit('changeFilter', value)"
    />
    <select
      @change="$emit('changePageSize', selectedPageSize)"
      v-model="selectedPageSize"
    >
      <option value="5">5 per page</option>
      <option value="25">25 per page</option>
      <option value="0">Show All</option>
    </select>
    <ul class="job-list">
      <li v-for="(jobListing, index) in jobListings" :key="index">
        <h1>{{ jobListing.job.title }}</h1>
        {{ jobListing.job.unit.display_name }}
        {{ jobListing.job.position_function.name_en }}
        {{ jobListing.job.due_date }}
      </li>
    </ul>
    <button v-if="prev && prev.length > 0" @click="$emit('previousPage')">
      Previous
    </button>
    <button v-if="next && next.length > 0" @click="$emit('nextPage')">
      Next
    </button>
  </div>
</template>

<style>
@import "./JobFeed.scss";
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { JobListing, PositionFunction } from "@/models/models";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

@Component({
  components: {
    Treeselect,
  },
})
export default class JobFeed extends Vue {
  @Prop({ default: () => [], type: Array as () => JobListing[] })
  public jobListings!: JobListing[];
  @Prop({ default: () => [], type: Array as () => PositionFunction[] })
  private positionFunctions!: PositionFunction[];
  @Prop({ default: "" })
  public next!: string;
  @Prop({ default: "" })
  public prev!: string;
  public value: any = null;
  public options: any[] = [];
  public selectedPageSize: number = 5;
  mounted() {
    // structure filter data into the right format on mount
    this.options = [];
    for (let i = 0; i < this.positionFunctions.length; i++) {
      let tempObj = {};
      tempObj["id"] = this.positionFunctions[i].id;
      tempObj["label"] = this.positionFunctions[i].name_en;
      tempObj["children"] = [];
      if (this.positionFunctions[i].children) {
        for (let j = 0; j < this.positionFunctions[i].children!.length; j++) {
          tempObj["children"].push({
            id: this.positionFunctions[i].children![j].id,
            label: this.positionFunctions[i].children![j].name_en,
          });
        }
      }
      this.options.push(tempObj);
    }
  }
}
</script>

<style src="@riophae/vue-treeselect/dist/vue-treeselect.min.css" scoped></style>
