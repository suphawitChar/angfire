import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  dataForm: FormGroup = this.formBuilder.group({
    name: null,
    age: null,
    address: null,
    id: null,
  });
  myArray: any;

  constructor(
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder
  ) {
    this.myArray = this.firestore
      .collection("items", (ref) => ref.orderBy("id", "asc"))
      .valueChanges();
  }

  onSubmit() {
    const data = this.firestore.collection('items', (ref) =>
      ref.where('id', '==', this.dataForm.value.id)
    );

    data.get().subscribe((res) => {
      if (res.docs.length != 0) {
        res.docs[0].ref.update(this.dataForm.value);
      } else {
        this.firestore.collection('items').add(this.dataForm.value);
      }
    });
  }

  onEdit(doc: any) {
    this.dataForm = this.formBuilder.group({
      name: doc.name,
      age: doc.age,
      address: doc.address,
      id: doc.id,
    });
  }

  onDelete(id: string, name: string) {
    if (confirm('Do you want to delete '+name+'?')) {
      const data = this.firestore.collection('items', (ref) =>
        ref.where('id', '==', id)
      );

      data.get().subscribe((res) => {
        if (res.docs.length != 0) {
          res.docs[0].ref.delete();
        }
      });
    }
  }
}
