import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  standalone: true,
  imports: [IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  title = 'ng16';
  firstName = signal('Peter');
  lastName = signal('Parker');

  signalCounter = 0;

  fullName = computed(() => {
    this.signalCounter++;
    console.log('signal name change');
    return `${this.firstName()} ${this.lastName()}`;
  });
  
  constructor() {}


  changeName() {
    this.signalCounter++;
    this.firstName.set('Signal Spider');
    this.lastName.set('Man');
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
}
