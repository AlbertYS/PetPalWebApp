setup() {
  # Clean the database
  rm backend/petpal/db.sqlite3
  touch backend/petpal/db.sqlite3

  # Migrations
  rm -r backend/petpal/accounts/migrations
  rm -r backend/petpal/applications/migrations
  rm -r backend/petpal/comments/migrations
  rm -r backend/petpal/listings/migrations
  rm -r backend/petpal/notifications/migrations
  rm -r backend/petpal/blogs/migrations
  rm -r images
  python backend/petpal/manage.py makemigrations accounts
  python backend/petpal/manage.py makemigrations applications
  python backend/petpal/manage.py makemigrations comments
  python backend/petpal/manage.py makemigrations listings
  python backend/petpal/manage.py makemigrations notifications
  python backend/petpal/manage.py makemigrations blogs
  python backend/petpal/manage.py migrate
}

deactivate
python3 -m venv venv
source venv/bin/activate
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install Pillow
pip install django-filter
pip install django-cors-headers

yes Y | setup

# Create a superuser
python backend/petpal/manage.py createsuperuser