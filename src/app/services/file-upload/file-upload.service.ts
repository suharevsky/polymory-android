import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {UserModel} from '../../models/user.model';
import {UserService} from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    uploadProgress;
    uploadState: Observable<string>;
    user: UserModel;
    downloadURL;
    public dimensions: any = {s: '120x120', l: '600x600'};

    constructor(
        private afStorage: AngularFireStorage,
        public userService: UserService,
    ) {
    }

    public uploadFile(event) {
        /* // create a random id
         const randomId = Math.random().toString(36).substring(2);
         // create a reference to the storage bucket location
         this.ref = this.afStorage.ref('/images/' + randomId);
         // the put method creates an AngularFireUploadTask
         // and kicks off the upload
         this.task = this.ref.put(event.target.files[0]);

         // AngularFireUploadTask provides observable
         // to get uploadProgress value
         this.uploadProgress = this.task.snapshotChanges()
             .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));

         // observe upload progress
         this.uploadProgress = this.task.percentageChanges();
         // get notified when the download URL is available
         this.task.snapshotChanges().pipe(
             finalize(() => {
               this.userService.getItemById(this.user.id).subscribe((user) => {

                 const photos = user.photos;
                 const mainPhoto = photos.filter(photo => photo.main === true);
                 photos.push({status: 0, main: mainPhoto.length !== 1, url: randomId});

                 // save photo src to database
                 const photo = {
                   id: this.user.id,
                   photos
                 };
                 this.userService.update(photo).subscribe();
               });
               this.downloadURL = this.ref.getDownloadURL();
             })
         ).subscribe();
         this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));*/
    }


    async reduce_image_file_size(base64Str, MAX_WIDTH = 600, MAX_HEIGHT = 600) {
        let resized_base64 = await new Promise((resolve) => {
            let img = new Image()
            img.src = base64Str
            img.onload = () => {
                let canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height
    
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height
                        height = MAX_HEIGHT
                    }
                }
                canvas.width = width
                canvas.height = height
                let ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                resolve(canvas.toDataURL()) // this will return base64 image results after resize
            }
        });
        return resized_base64;
    }
    
    async process_image(base64, min_image_size = 300) {
      
        const old_size = this.calc_image_size(base64);

        if (old_size > min_image_size) {
            const resized = await this.reduce_image_file_size(base64);
            const new_size = this.calc_image_size(resized)
            console.log('new_size=> ', new_size, 'KB');
            console.log('old_size=> ', old_size, 'KB');
            return resized;
        } else {
            return base64;
        }
    }
    
    /*- NOTE: USE THIS JUST TO GET PROCESSED RESULTS -*/
    async preview_image(base64) {
        const image = await this.process_image(base64);
        return image
    }


    public calc_image_size(image) {

        let y = 1;
        if(image.endsWith('==')) {
            y = 2
        }
        const x_size = (image.length * (3 / 4)) - y;
        return Math.round(x_size / 1024);
    }


    public getBaseUrl(fileName, dimensions = 's') {

        if (fileName && fileName.includes('default.jpg')) {
            return fileName;
        }

        fileName += '_';

        if (dimensions === 's') {
            fileName = fileName + this.dimensions[dimensions];
        }

        if (dimensions === 'm') {
            fileName = fileName + this.dimensions[dimensions];
        }

        if (dimensions === 'l') {
            fileName = fileName + this.dimensions[dimensions];
        }

        // return  fileName;
        
         return 'https://firebasestorage.googleapis.com/v0/b/polymatch-d1996.appspot.com/o/images%2F' + fileName + '?alt=media';
    }

    getImageDimensions(): object {
        return this.dimensions;
    }
}
