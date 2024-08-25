import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { ProductKeyValue } from '../interfaces';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SuggestionsComponent implements OnInit {
  @Input() categoty:'drum' | 'bass' | 'guitar' | 'piano' | 'other' = 'guitar'
  public randomSuggestions?:ProductKeyValue[] 
  constructor(private service:SharedServiceService,private cd:ChangeDetectorRef) {}

  ngOnInit(): void {
   this.service.getRandomProducts(this.categoty).subscribe(res=>{
    this.randomSuggestions = res  
    this.cd.detectChanges()
      
   })
  }
}
