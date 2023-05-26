import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {KtdGridLayout, ktdTrackById} from '@katoid/angular-grid-layout';
import {StashService} from "../../services/stash/stash.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Thing} from "../../models/thing/thing.model";
import {StashComponent} from "../stash/stash.component";
import {EMPTY, Observable, of, take} from "rxjs";
import {Attribute} from "../../models/attribute/attribute.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
@Component({
  selector: 'app-thing',
  templateUrl: './thing.component.html',
  styleUrls: ['./thing.component.css']
})
export class ThingComponent implements OnInit {
  public thing: Observable<Thing | null> = EMPTY;
  public things: Observable<Thing[]> = new Observable<Thing[]>();

  public editingThing: Observable<Thing> = new Observable<Thing>();
  public createOrUpdateThingForm!: FormGroup;
  public tplModalButtonLoading: boolean = false;
  public modalTitle: string = "Create Thing";

  constructor(
    private stash: StashService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modal: NzModalService
) {

  }
  tabBarStyle = {
    'margin': '0 0px 0 0px',
  };
  ngOnInit() {
    this.route.url.subscribe(url => {
      console.log('The URL changed to: ' + url)
    } );
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.thing = this.stash.getThing(id)
    });
    this.things = this.stash.getThings();
    this.createOrUpdateThingForm = this.fb.group({
      name: [null, [Validators.required]],
    });
  }

  protected readonly StashComponent = StashComponent;
  tabs = [1, 2, 3];

  onThingsChange($event: string) {
    this.things = this.stash.getThings();
  }

  onThingChange($event: string) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.thing = this.stash.getThing(id)
    });
  }

  createModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, thingObservable: Observable<Thing | null>): void {
    thingObservable.pipe(take(1)).subscribe(thing => {
      if(thing === null) {
        this.modalTitle = 'Create Thing';
        thing = new Thing();
      } else {
        this.modalTitle = 'Edit Thing';
      }

      this.editingThing = of(thing);
      this.createOrUpdateThingForm.setValue({
        name: thing.name
      });
      this.modal.create({
        nzTitle: tplTitle,
        nzContent: tplContent,
        nzFooter: tplFooter,
        nzMaskClosable: false,
        nzClosable: true,
        nzOnOk: () => console.log('Click ok')
      });
    });
  }
  destroyTplModal(modelRef: NzModalRef): void {
    this.tplModalButtonLoading = true;
    this.editingThing = new Observable<Thing>();
    setTimeout(() => {
      this.tplModalButtonLoading = false;
      modelRef.destroy();
    }, 1000);
  }

  deleteThing(ref: any) {

  }

  updateThing( modelRef: NzModalRef) {
    this.thing.pipe(take(1)).subscribe(thing => {
      if (thing === null) return;
      if (this.editingThing === null) return;
      this.editingThing.pipe(take(1)).subscribe(thing => {
        this.stash.updateThing(thing._id, this.createOrUpdateThingForm.value).pipe(take(1)).subscribe({
          next: query => {
            console.log('updated Thing');
            this.destroyTplModal(modelRef);
          },
          error: error => {
            console.error(error);
          }
        });
      });
    })
  }

  createThing(ref: any) {

  }
}
