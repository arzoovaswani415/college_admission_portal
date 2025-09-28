import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdmissionFormComponent } from './components/admission-form/admission-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ChatbotPlaceholderComponent } from './components/chatbot-placeholder/chatbot-placeholder.component';
import { VeridiaUniversityComponent } from './components/veridia-university/veridia-university.component';
import { ProgramDetailComponent } from './components/program-detail/program-detail.component';
import { ScholarshipsComponent } from './components/scholarships/scholarships.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'apply', component: AdmissionFormComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'chatbot', component: ChatbotPlaceholderComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'veridia', component: VeridiaUniversityComponent },
  { path: 'programs/:id', component: ProgramDetailComponent },
  { path: 'scholarships', component: ScholarshipsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
