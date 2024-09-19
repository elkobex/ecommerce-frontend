import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { SeoService } from './core/services/seo.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet, ResponsiveHelperComponent]
})
export class AppComponent implements OnInit {

  private router = inject(Router);
  private seo = inject(SeoService);
  
  ngOnInit(): void {
    // this.seo.title.setTitle("EhloQtedigo");
    // this.seo.meta.updateTag({name: "description", content: "Esta es una prueba xddd"});
    // this.seo.setCanonicalURL("https://ehloqtedigo.com");
    // this.seo.setIndexFollow(true);
  }

  navigate(route: string){
    if(!route || !route.length) return;
    this.router.navigate([route]);
    // this.router.navigate(['/auth']);
  }
}