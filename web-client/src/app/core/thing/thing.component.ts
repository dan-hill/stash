import {Component, OnInit} from '@angular/core';
import {KtdGridLayout, ktdTrackById} from '@katoid/angular-grid-layout';
import {StashService} from "../../services/stash/stash.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Thing} from "../../models/thing/thing.model";
import {StashComponent} from "../stash/stash.component";
@Component({
  selector: 'app-thing',
  templateUrl: './thing.component.html',
  styleUrls: ['./thing.component.css']
})
export class ThingComponent implements OnInit {
  public thing: Thing = new Thing();

  cols: number = 6;
  rowHeight: number = 100;
  layout: KtdGridLayout = [
    {id: 'attributes', x: 0, y: 0, w: 3, h: 3},
    {id: 'instances', x: 3, y: 0, w: 3, h: 3},
    {id: '2', x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3},
    {id: '3', x: 3, y: 3, w: 3, h: 3, minW: 2, maxW: 3, minH: 2, maxH: 5},
  ];
  trackById = ktdTrackById

  constructor(
    private stash: StashService,
    private route: ActivatedRoute,
    private router: Router
) {

  }

  ngOnInit() {
    this.route.url.subscribe(url => {
      console.log('The URL changed to: ' + url)
    } );
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.stash.getThing(id).subscribe((query: any) => {
        this.thing = query.thing;
      });
    });
  }
  onLayoutUpdated(layout: KtdGridLayout) {
    this.layout = layout;
  }

  protected readonly StashComponent = StashComponent;
  tabs = [1, 2, 3];
}
