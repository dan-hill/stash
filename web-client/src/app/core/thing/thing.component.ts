import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {KtdGridLayout, ktdTrackById} from '@katoid/angular-grid-layout';
import {StashService} from "../../services/stash/stash.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Thing} from "../../models/thing/thing.model";
import {StashComponent} from "../stash/stash.component";
import {EMPTY, Observable, of} from "rxjs";
import {Attribute} from "../../models/attribute/attribute.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
@Component({
  selector: 'app-thing',
  templateUrl: './thing.component.html',
  styleUrls: ['./thing.component.css']
})
export class ThingComponent implements OnInit {
  public thing: Observable<Thing | null> = EMPTY;
  public things: Observable<Thing[]> = new Observable<Thing[]>();

  private editingThing: Observable<Thing> = new Observable<Thing>();
  createOrUpdateThingForm!: FormGroup;
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

  createModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, thing: Thing | null): void {

    if(thing === null) {
      this.modalTitle = 'Create Attribute';
      thing = new Thing();
    } else {
      this.modalTitle = 'Edit Attribute';
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
  }
  destroyTplModal(modelRef: NzModalRef): void {
    this.tplModalButtonLoading = true;
    this.editingThing = new Observable<Thing>();
    setTimeout(() => {
      this.tplModalButtonLoading = false;
      modelRef.destroy();
    }, 1000);
  }

}
