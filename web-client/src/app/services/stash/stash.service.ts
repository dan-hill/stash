import { Injectable} from '@angular/core';
import {ThingsService} from "../things";

@Injectable({ providedIn: 'root' })
export class StashService {
  constructor(
    public things: ThingsService
  ) {}


}
