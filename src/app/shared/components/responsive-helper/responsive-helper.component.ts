import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-responsive-helper',
  standalone: true,
  imports: [],
  templateUrl: './responsive-helper.component.html',
  styleUrl: './responsive-helper.component.scss'
})
export class ResponsiveHelperComponent {
  public env: any = environment;
}
