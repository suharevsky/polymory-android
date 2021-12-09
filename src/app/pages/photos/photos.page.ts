import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {Crop} from '@ionic-native/crop/ngx';
import {File} from '@ionic-native/file/ngx';
import {ActionSheetController, AlertController, ModalController, NavController, ToastController} from '@ionic/angular';
import {FileUploadService} from '../../services/file-upload/file-upload.service';
import {ImageCroppedEvent, ImageTransform} from '../../interfaces/image-cropper';
import {FabricjsEditorComponent} from '../../components/angular-editor-fabric-js/src/lib/angular-editor-fabric-js.component';
import {UserModel} from '../../models/user.model';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'app-photos',
    templateUrl: './photos.page.html',
    styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {

    @ViewChild('canvas', {static: false}) canvas: FabricjsEditorComponent;
    public user: UserModel;
    public croppedImagepath = '';
    public uploadingProcess = false;
    public downloadURL;
    public uploadState: Observable<string>;
    public isLoading = false;
    public containWithinAspectRatio = false;
    public showCropper = false;
    public imgLoaded = false;
    public uploadProgress;
    public isPrivateSelectedImage: boolean = false
    public ref: AngularFireStorageReference;
    public task: AngularFireUploadTask;
    public imagePickerOptions = {
        maximumImagesCount: 1,
        quality: 70
    };
    public masks = [
        'https://firebasestorage.googleapis.com/v0/b/joyme-19532.appspot.com/o/masks%2F1_600x600.png?alt=media&token=5f4c1804-aa4f-472e-aa84-a2e443bd032e',
        'https://firebasestorage.googleapis.com/v0/b/joyme-19532.appspot.com/o/masks%2F2_600x600.png?alt=media&token=4accdac2-414e-4f0e-a43a-efde5bfa182b',
        'https://firebasestorage.googleapis.com/v0/b/joyme-19532.appspot.com/o/masks%2F3_600x600.png?alt=media&token=a7ee88c6-52f7-45e4-be42-5ffe2a61a57a'
    ];
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
        private authService: AuthService,
        private file: File,
        private navCtrl: NavController,
        public toastController: ToastController,
        public actionSheetController: ActionSheetController,
    ) {
    }

    ngOnInit() {
        this.newUser = localStorage.getItem('newUser') === 'true';
        this.userService.getUser();
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


    addImageOnCanvas(url) {
        this.canvas.confirmClear();
        this.setCanvasImage(this.croppedImage);
        this.canvas.addImageOnCanvas(url);
    }

    setSegment(segment) {
        if (segment === 3) {
            setTimeout(() => {
                const element: HTMLElement = document.querySelector('.add-image-on-canvas') as HTMLElement;
                element.click();
            });
        }
        this.segment = segment;
    }

    cancelUpload() {
        this.segment = 1;
        this.imgLoaded = false;
        this.croppedImage = null;
    }

    fileChangeEvent(event: any): void {
        const _URL = window.URL || window.webkitURL;
        let file, img;

        // tslint:disable-next-line:no-conditional-assignment
        if ((file = event.target.files[0])) {
            img = new Image();
            img.onload = (e: any) => {
                if (e.path[0].height < 590 || e.path[0].width < 590) {
                    this.presentToast('שגיאה: התמונה קטנה מדי');
                } else {
                    this.imageChangedEvent = event;
                    this.imgLoaded = true;
                }
            };
            img.onerror = () => {
                this.presentToast('not a valid file: ' + file.type);
            };
            img.src = _URL.createObjectURL(file);
            
        }
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    done() {
        localStorage.removeItem('newUser');
        this.modalCtrl.dismiss();
    }

    imageLoaded() {
        this.showCropper = true;
    }

    loadImageFailed() {
        console.log('Load failed');
    }

    rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
    }

    public getImgPolaroid(event) {
        this.canvas.getImgPolaroid(event);
    }

    imgErrorHandler(e, src) {
        console.error(e.target.src);
        e.target.src = src;
    }

    public rasterize() {

        let src = '';
        if (this.segment === 3) {
            src = this.canvas.rasterize();
        } else {
            src = this.croppedImage;
        }
        this.uploadFile(src);
    }


    uploadFile(src) {

        this.uploadingProcess = true;
        // create a random id
        const randomId = Math.random().toString(36).substring(2);

        // create a reference to the storage bucket location
        this.ref = this.afStorage.ref('/images/' + randomId);
        // the put method creates an AngularFireUploadTask
        // and kicks off the upload
        const file = this.imageChangedEvent.target.files[0];
        // console.log(base64result);
        this.task = this.ref.put(file);

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

                this.userService.user.photos = photos;

                this.userService.user.allPhotosApproved = this.userService.allPhotosApproved();
                this.userService.user.mainPhotoApproved = this.userService.mainPhotoApproved();

                this.userService.update(this.userService.user).subscribe(() => {},
                err => console.log(err),
                () => {
                        this.uploadingProcess = false;
                        this.userService.user.photos = photos;
                        setTimeout(()=> {
                            console.log('checkImageValidation');
                            console.log(newImage);
                            
                            if(this.imageExists(this.fileUploadService.getBaseUrl(newImage.url))) {
                                this.isPrivateSelectedImage ?
                                this.privatePhotos.push(newImage): this.publicPhotos.push(newImage);
                                this.cancelUpload();
                            }
                        }, 100)
                });
                 this.downloadURL = this.ref.getDownloadURL();
            })
        ).subscribe();
         this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    }

    imageExists(image_url){

        var http = new XMLHttpRequest();
    
        http.open('HEAD', image_url, false);
        http.send();
    
        return http.status != 404;
    }

    public addFigure(figure) {
        this.canvas.confirmClear();
        this.setCanvasImage(this.croppedImage);

        setTimeout(() => {
            this.canvas.addFigure(figure);
        });
    }

    setCanvasImage(url) {
        this.canvas.setCanvasImage(url);
    }

    setZoom() {
        const scale = this.scale;
        this.transform = {
            ...this.transform,
            scale
        };
    }


    pickImage(sourceType) {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType
        };
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            this.imageBase64 = 'data:image/jpeg;base64,' + imageData;

            // this.cropImage(base64Image);
            // this.uploadFile(base64Image);
            this.imageChangedEvent = this.imageBase64;
            this.imgLoaded = true;
        }, (err) => {
            // Handle error
        });
    }

    base64ToImage(dataURI) {
        const fileDate = dataURI.split(',');
        //const mime = fileDate[0].match(/:(.*?);/)[1];
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
        console.log(photo);
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

        const {role} = await alert.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
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
                            //this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                            const element: HTMLElement = document.querySelector('input[type=file]') as HTMLElement;
                            element.click();
                        }
                    },

                        {
                            text: 'ביטול',
                            role: 'cancel'
                        }
                    ]
                });

                await actionSheet.present();

            }
        }
    }

    setAsMain(photo) {
        this.userService.setAsMainPhoto(photo);
    }

    cropImage(fileUrl) {
        this.crop.crop(fileUrl, {quality: 100})
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

    private flipAfterRotate() {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
            ...this.transform,
            flipH: flippedV,
            flipV: flippedH
        };
    }
}
