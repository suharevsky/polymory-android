import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {Camera, CameraOptions} from '@awesome-cordova-plugins/camera/ngx';
import {Crop} from '@ionic-native/crop/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import {ActionSheetController, AlertController, ModalController, NavController, ToastController} from '@ionic/angular';
import {FileUploadService} from '../../services/file-upload/file-upload.service';
import {ImageCroppedEvent, ImageTransform} from '../../interfaces/image-cropper';
import {UserModel} from '../../models/user.model';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import { GeneralService } from 'src/app/services/general/general.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'app-photos',
    templateUrl: './photos.page.html',
    styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {

    public user: UserModel;
    public croppedImagepath = '';
    public uploadingProcess = false;
    public downloadURL;
    public uploadState: Observable<string>;
    public isLoading = false;
    public containWithinAspectRatio = false;
    public showCropper = false;
    public defaultImage = '';
    public imgLoaded = false;
    public uploadProgress;
    public isPrivateSelectedImage: boolean = false
    public ref: AngularFireStorageReference;
    public task: AngularFireUploadTask;
    public imagePickerOptions = {
        maximumImagesCount: 1,
        quality: 70
    };
  
    public imageChangedEvent: any = '';
    public croppedImage: any = '';
    public canvasRotation = 0;
    public imageBase64 = '';
    public transform: ImageTransform = {};
    public scale = 1;
    public rotation = 0;
    public segment = 1;
    public blur = 10;
    public newUser: boolean = false;
    public privatePhotos = [];
    public publicPhotos = [];

    constructor(
        public modalCtrl: ModalController,
        public alertController: AlertController,
        public userService: UserService,
        public fileUploadService: FileUploadService,
        private afStorage: AngularFireStorage,
        private camera: Camera,
        private crop: Crop,
        private file: File,
        private navCtrl: NavController,
        public toastController: ToastController,
        public actionSheetController: ActionSheetController,
        public generalService: GeneralService,
        public authService: AuthService,
        private _ngZone: NgZone
    ) {
    }
    ngOnInit() {
        this.newUser = localStorage.getItem('newUser') === 'true';
      
    }

    ionViewWillEnter() {
        this.privatePhotos = this.userService.user.photos.filter(photo => photo.isPrivate);
        this.publicPhotos = this.userService.user.photos.filter(photo => !photo.isPrivate);
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message,
            duration: 3000
        });
        await toast.present();
    }

    async photosProfile() {
        const modal = await this.modalCtrl.create({
            component: PhotosPage,
        });
        return await modal.present();
    }

    goToPhotos() {
        localStorage.removeItem('newUser');
        this.modalCtrl.dismiss();
        this.navCtrl.navigateForward('/tabs/highlights');
    }

    setSegment(segment) {
        this.segment = segment;
    }

    cancelUpload() {
        this.segment = 1;
        this.imgLoaded = false;
        this.croppedImage = null;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    done() {
        if(this.newUser) {
            localStorage.removeItem('newUser');
            this.navCtrl.navigateForward('/tabs/highlights');
        }
        
        this.modalCtrl.dismiss();
    }

    imageLoaded() {
        this.showCropper = true;
    }

    loadImageFailed() {
        console.log('Load failed');
    }

    public async rasterize() {
        let src = await this.fileUploadService.preview_image(this.croppedImage);
        //@ts-ignore
        this.defaultImage = src;
        this.uploadFile(src);
    }

    async uploadFile(src) {

        this.uploadingProcess = true;
        // create a random id
        const randomId = Math.random().toString(36).substring(2);
        // create a reference to the storage bucket location
        this.ref = this.afStorage.ref('/images/' + randomId);
        // the put method creates an AngularFireUploadTask
        // and kicks off the upload
        const base64result = src.split(',')[1];
        // console.log(base64result);
        this.task = this.ref.putString(base64result, 'base64', {
            contentType: 'image/jpeg'
        });


        // AngularFireUploadTask provides observable
        // to get uploadProgress value
        this.uploadProgress = this.task.snapshotChanges()
            .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));

        // observe upload progress
        this.uploadProgress = this.task.percentageChanges();

        // get notified when the download URL is available
        this.task.snapshotChanges().pipe(
            finalize(() => {

                const photos = this.userService.user.photos;
                const mainPhoto = photos.filter(el => el.main === true);
                let newImage = {status: 0, id: randomId, main: mainPhoto.length !== 1, url: randomId, isPrivate: this.isPrivateSelectedImage}
                photos.push(newImage);

                this.isPrivateSelectedImage ?
                    this.privatePhotos.push(newImage): this.publicPhotos.push(newImage)
       
                this.userService.user.photos = photos;
                this.userService.user.allPhotosApproved = this.userService.allPhotosApproved();
                this.userService.user.mainPhotoApproved = this.userService.mainPhotoApproved();
                this.uploadingProcess = false;
                // Close crop area
                this.cancelUpload();
                this.userService.save(this.userService.user).subscribe(() => {},
                err => console.log(err),
                () => {
                    // setTimeout(() =>{
                    //     this.userService.user.photos = photos;
                    // },900)
                });

                // this.downloadURL = this.ref.getDownloadURL();

            })
        ).subscribe();
        // this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    }


    setZoom() {
        const scale = this.scale;
        this.transform = {
            ...this.transform,
            scale
        };
    }

    async pickImage(sourceType) {

        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType
        };

        this.camera.getPicture(options).then((imageData) => {
            this._ngZone.run(() => {
                this.imgLoaded = true;
            });            
            // imageData is either a base64 encoded string or a file URI
            this.imageBase64 = 'data:image/jpeg;base64,' + imageData;
            this.imageChangedEvent = this.imageBase64;
        }, (err) => {
            // Handle error
        });
    }

    base64ToImage(dataURI) {
        const fileDate = dataURI.split(',');
        // const mime = fileDate[0].match(/:(.*?);/)[1];
        const byteString = atob(fileDate[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], {type: 'image/png'});
        return blob;
    }

    async delete(photo) {
        const alert = await this.alertController.create({
            header: 'מחיקת תמונה',
            message: 'האם למחוק את התמונה?',
            buttons: [{
                text: 'לא!',
                role: 'cancel',
                handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                }
            }, {
                text: 'כן, מחק',
                handler: () => {
                     this.privatePhotos = this.userService.user.photos.filter(photoEl => {
                         return photoEl.id !== photo.id && photoEl.isPrivate;
                     });
                     this.publicPhotos = this.userService.user.photos.filter(photoEl => {
                         return photoEl.id !== photo.id && !photoEl.isPrivate;
                     });

                     this.userService.deletePhoto(photo);
                }
            }]
        });

        await alert.present();
    }

    async selectImage(event, addNew = false, photo: any = '', isPrivate: boolean = false) {

        this.isPrivateSelectedImage = isPrivate;

        if (event.target.classList.contains('select-image')) {
            if (addNew) {
                const actionSheet = await this.actionSheetController.create({
                    header: 'העלאת תמונה מ...',
                    buttons: [{
                        text: 'גלריה',
                        handler: () => {
                            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                        }
                    },
                        {
                            text: 'מצלמה',
                            handler: () => {
                                this.pickImage(this.camera.PictureSourceType.CAMERA);
                            }
                        },
                        {
                            text: 'ביטול',
                            role: 'cancel'
                        }
                    ]
                });

                await actionSheet.present();
                

            } else if(!photo.main) {

                const buttonOptions = {
                    buttons: [{
                        text: 'למחוק את התמונה',
                        handler: () => {
                            this.delete(photo);
                        }
                    },
                    {
                        text: photo?.isPrivate ? 'הגדר כציבורי' : 'הגדר כפרטי',
                        handler: () => {
                            // this.delete(photo);
                            this.userService.user.photos.map(photoEl => {
                                if(photoEl.id === photo.id ) {
                                    photoEl.isPrivate = photoEl.isPrivate ? false : true;
                                }
                                return photoEl;
                            });

                            this.privatePhotos = this.userService.user.photos.filter(photoEl => {
                                return photoEl.isPrivate;
                            });

                            this.publicPhotos = this.userService.user.photos.filter(photoEl => {
                                return !photoEl.isPrivate;
                            });

                            this.userService.save(this.userService.user).subscribe();
                        }
                    },

                        {
                            text: 'ביטול',
                            role: 'cancel'
                        }
                    ]
                };

                if (photo.status === 1 && photo.main === false && photo.isPrivate === false) {
                    buttonOptions.buttons.push({
                        text: 'לעשות כתמונה הראשית',
                        handler: () => {
                            this.setAsMain(photo);
                        }
                    })
                }
                const actionSheet = await this.actionSheetController.create(buttonOptions);
                await actionSheet.present();
            }
        }
    }

    setAsMain(photo) {
        this.publicPhotos.map(el => {
            el.main = el.url === photo.url;
        });

        this.userService.setAsMainPhoto(photo);
    }

    cropImage(fileUrl) {
        this.crop.crop(fileUrl, {quality: 75})
            .then(
                newPath => {
                    this.showCroppedImage(newPath.split('?')[0])
                },
                error => {
                    alert('Error cropping image' + error);
                }
            );
    }

    showCroppedImage(ImagePath) {
        this.isLoading = true;
        const splitPath = ImagePath.split('/');
        const imageName = splitPath[splitPath.length - 1];
        const filePath = ImagePath.split(imageName)[0];

        this.file.readAsDataURL(filePath, imageName).then(base64 => {
            this.croppedImagepath = base64;
            this.isLoading = false;
        }, error => {
            alert('Error in showing image' + error);
            this.isLoading = false;
        });
    }

}
