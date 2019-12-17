CURDIR=$(dirname "$(readlink -f "$0")")
BASEDIR=$(readlink -f "$CURDIR/..")

INSTALL=0
UPDATE=0
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
    -i | --install)
        INSTALL=1
        shift # past value
        ;;
    -u | --update)
        UPDATE=1
        shift # past value
        ;;

    esac
done

cd ${BASEDIR}
error=0

if [ $(which -a npm | wc -l) -eq 0 ]; then
    echo "Error: NPM needs to be installed!"
    error=1
fi

if [ $(which -a npm-workspace | wc -l) -eq 0 ]; then
    if [ $INSTALL -eq 1 ]; then
        npm i -g npm-workspace
    else
        echo "Error: NPM-WORKSPACE needs to be installed!"
        error=1
    fi
fi

if [ $(which -a pkg | wc -l) -eq 0 ]; then
    if [ $INSTALL -eq 1 ]; then
        npm i -g pkg
    else
        echo "Error: PKG needs to be installed!"
        error=1
    fi
fi

if [ $(which -a release-it | wc -l) -eq 0 ]; then
    if [ $INSTALL -eq 1 ]; then
        npm i -g release-it
    else
        echo "Error: RELEASE-IT needs to be installed!"
        error=1
    fi
fi

if [ $error -eq 1 ]; then
    exit 1
fi

if [ $UPDATE -eq 1 ]; then
    npm i -g pkg npm-workspace release-it
fi

git submodule update --init

npm-workspace install
npm install
npm rebuild
