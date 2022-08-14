import { AxiosStatic } from "axios";
import { IPage, JobListing, PositionFunction, Unit } from "@/models/models";

export default class BaseApi {
  public axios!: AxiosStatic;
  protected baseUrl: string;

  constructor(url: string, axios: AxiosStatic) {
    this.baseUrl = url;
    this.axios = axios;
  }

  public getPositionFunctions = (): Promise<IPage<PositionFunction>> =>
    this.axios
      .get(`${this.baseUrl}job/position-functions/?page_size=100`)
      .then((response) => response.data);

  public getJobListings = (
    pageNum: number,
    pageSize: number,
    positionFunctions: number[] = []
  ): Promise<IPage<JobListing>> => {
    if (positionFunctions.length > 0)
      return this.axios
        .get(
          `${
            this.baseUrl
          }job/listings/?page=${pageNum}&page_size=${pageSize}&use_pagination=True&position_functions=${positionFunctions.join()}`
        )
        .then((response) => response.data);
    else
      return this.axios
        .get(
          `${this.baseUrl}job/listings/?page=${pageNum}&page_size=${pageSize}&use_pagination=True`
        )
        .then((response) => response.data);
  };

  /**
   * TIP: Create a function called getJobListings
   * Use our public api documentation to find out what endpoint to use
   * https://test-api.mojob.io/public/docs/
   */
}
