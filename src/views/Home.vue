<template>
  <div class="home">
    <job-feed
      :job-listings="jobListings"
      :position-functions="positionFunctionFilters"
      :next="next"
      :prev="prev"
      @previousPage="previousPage"
      @nextPage="nextPage"
      @changePageSize="changeSize"
      @changeFilter="changeFilter"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import JobFeed from "@/components/JobFeed.vue";
import BaseApi from "@/api-requests/api";
import { IPage, JobListing, PositionFunction } from "@/models/models";

@Component({
  components: {
    JobFeed,
  },
})
export default class Home extends Vue {
  private mojobApi: BaseApi | null = null;
  public positionFunctionFilters: PositionFunction[] = [];
  public jobListings: JobListing[] = [];
  public next: string = "";
  public prev: string = "";
  private currentPage: number = 1;
  private currentPageSize: number = 5;
  private filter: any[] = [];

  /**
   * Here you can do necessary request to our
   * public test-API in order to retrieve a list of job listings and a list of
   * position function filters.
   *
   * You can test the endpoints and see the documentation at:
   * https://test-api.mojob.io/public/docs/
   *
   * @private
   */
  private async mounted() {
    // Here is an example on how to retrieve job position function filters
    this.mojobApi = new BaseApi(
      "https://test-api.mojob.io/public/",
      this.axios
    );
    try {
      const jobLocationFiltersResponsePage: IPage<PositionFunction> = await this.mojobApi.getPositionFunctions();
      if (jobLocationFiltersResponsePage.results) {
        this.positionFunctionFilters = jobLocationFiltersResponsePage.results;
      } else {
        console.log("Failed loading position function filters");
      }
      await this.fetchJobListings();
    } catch (e) {
      console.log("Failed loading job listings");
      console.log(e);
    }
  }

  private async fetchJobListings() {
    const jobListingsResponsePage: IPage<JobListing> = await this.mojobApi!.getJobListings(
      this.currentPage,
      this.currentPageSize,
      this.filter
    );
    this.next = jobListingsResponsePage.next!;
    this.prev = jobListingsResponsePage.previous!;
    if (jobListingsResponsePage.results) {
      this.jobListings = jobListingsResponsePage.results;
    } else {
      console.log("Failed loading job listings");
    }
  }

  async previousPage() {
    this.currentPage--;
    await this.fetchJobListings();
  }

  async nextPage() {
    this.currentPage++;
    await this.fetchJobListings();
  }

  async changeSize(pageSize) {
    // set page size as need be 1000 is just an arbitrarily large number
    this.currentPageSize = pageSize ? pageSize : 1000;
    await this.fetchJobListings();
  }

  async changeFilter(value) {
    this.filter = value;
    await this.fetchJobListings();
  }
}
</script>
