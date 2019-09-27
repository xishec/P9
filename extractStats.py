import os
import re
from config import *
import argparse

TEMP_STAT_FILE = "./__out__"
BIG_COMMIT_TRESHOLD = 1000

class Commit:
    def __init__(self):
        self.id = "No ID"
        self.date = "No date"
        self.commiter ="No author"
        self.authors = []

class RegularCommit(Commit):
    def __init__(self):
        super().__init__()
        self.files = 0
        self.inserted = 0
        self.deleted = 0
        self.task = NONE

class MergeCommit(Commit):
    def __init__(self):
        super().__init__()
        self.branch = "Undefined"

class StatAuthor:
    def __init__(self):
        self.inserted = 0
        self.deleted = 0
        self.commits = 0

def intersection(l1,l2):
    result = []
    for item in l1:
        if item in l2:
            result.append(item)
    return result

def cleanLine(line):
    line = line.replace("("," (")
    line = line.replace(")",") ")
    line = line.replace(":"," : ")
    line = line.replace("-"," - ")
    return line


def getStatFile(tempFile = TEMP_STAT_FILE):
    os.system("git log --shortstat --date=short > {}".format("./__out__"))
    stats = open(tempFile)
    return stats


def removeStatFile(tempFile = TEMP_STAT_FILE):
    if os.path.exists(tempFile):
        os.remove(tempFile)


def containsOne(array1,array2):
    for item in array1:
        if item in array2:
            return True
    return False

def readNextLine(file):
    line = file.readline()
    if line == "":
        file.close()
        removeStatFile("__out__")
        raise Exception("Fin de lecture anormale")
    return re.split(" |:",line.strip())

def readNextLineAndClean(file):
    line = file.readline()
    if line == "":
        file.close()
        removeStatFile("__out__")
        raise Exception("Fin de lecture anormale")
    line = cleanLine(line.strip())
    return re.split(" |:",line)

def findTask(list):
    if containsOne(list,config["task_code"]["dev"]):
        return DEV
    elif containsOne(list,config["task_code"]["debug"]):
        return DEBUG
    elif containsOne(list,config["task_code"]["refactor"]):
        return REFACTOR
    elif containsOne(list,config["task_code"]["test"]):
        return TEST
    elif containsOne(list,config["task_code"]["other"]):
        return OTHER
    else:
        return NONE


def findAuthors(list):
    if args.authors:
        target_authors = args.authors
    elif 'authors_id' in config:
        target_authors = config['authors_id']
    else:
        target_authors = []

    authors = []
    for a in target_authors:
        if a in list:
            authors.append(a)

    return authors

def skipRemaining(stats):
    line = stats.readline()
    while line != "" and not line.startswith("commit"):
        line = stats.readline()
    return line

def processError(stats,line)  :
    print("Erreur de lecture: ")
    print(" ".join(line))
    return skipRemaining(stats)


def accept(commit):

    if args.sprint:
        begin_date = sprints[args.sprint]['begin']
        end_date = sprints[args.sprint]['end']

    else:
        begin_date = date(*args.begin) if args.begin else config['period'].get('begin',date(1,1,1))
        end_date = date(*args.end) if args.end else config['period'].get('end',date(9999,1,1))

    if commit.date < begin_date:
        return False
    if end_date < commit.date:
        return False

    if args.authors:
        if intersection(commit.authors, args.authors) == []:
            return False
    else:
        if 'authors' in config and commit.commiter not in config['authors']:
            if 'authors_id' in config:
                if intersection(commit.authors,config['authors_id']) == []:
                    return False

    if type(commit) is RegularCommit:
        if args.tasks:
            if commit.task not in args.tasks:
                return False
        else:
            if 'tasks' in config and commit.task not in config['tasks']:
                return False
    else:
        if not config['merge']:
            return False

    if commit.id in config['forget']:
        return False

    if type(commit) is RegularCommit:
        if commit.inserted > BIG_COMMIT_TRESHOLD or commit.deleted > BIG_COMMIT_TRESHOLD:
            print("*** Very big commit: {}  ins. = {}  del. = {}".format(commit.id,commit.inserted,commit.deleted))
            return False

    return True

def parseStats(stats):
    commits = []

    line = stats.readline()
    while line != "":
        line = line.strip().split(' ')
        if line[0] == "commit":
            commitId = line[1]
        else:
            line = processError(stats)
            continue

        # Ignore merge line
        line = readNextLine(stats)
        if line[0] == "Merge":
            newCommit = MergeCommit()
            line = readNextLine(stats)
        else:
            newCommit = RegularCommit()

        newCommit.id = commitId

        # read author line
        if line[0] == "Author":
            newCommit.commiter = line[-1]
        else:
            line = processError(stats,line)
            continue

        # read date line
        line = readNextLine(stats)
        if line[0] == "Date":
            dateInfo = line[-1].split("-")
            newCommit.date = date(int(dateInfo[0]),int(dateInfo[1]),int(dateInfo[2]))
        else:
            line = processError(stats,line)
            continue

        # read blank line
        line = readNextLine(stats)

        if type(newCommit) is RegularCommit:
            line = readNextLineAndClean(stats)
            line = list(map(lambda x: x.upper(), line))
            newCommit.task = findTask(line)
            newCommit.authors = findAuthors(line)

            while True:
                line = readNextLine(stats)

                if len(line) > 1 and line[1] == "reverts":
                    break

                if len(line) > 2 and line[2] == "changed,":
                    break

                if len(line) > 0 and line[0] == "Merge":
                    break

            if line[2] == "changed,":
                newCommit.files = line[0]
                if line[4].startswith("insertion"):
                    newCommit.inserted = int(line[3])
                    if len(line) > 5:
                        newCommit.deleted = int(line[5])

                if line[4].startswith("deletion"):
                    newCommit.deleted = int(line[3])
            elif line[1] == 'reverts':
                line = skipRemaining(stats)
                continue
            else:
                line = processError(stats, line)
                continue


        else:
            line = readNextLine(stats)
            if line[0] == "Merge":
                if len(line) > 2:
                    newCommit.branch = line[2]

        if accept(newCommit):
            commits.append(newCommit)

        line = skipRemaining(stats)

    stats.close()
    removeStatFile("./__out__")
    return commits
        


def statsPerCommiter(commits):
    stats = {}

    for c in filter(lambda c: type(c) is RegularCommit, commits):
        if c.commiter not in stats:
            stats[c.commiter] = StatAuthor()

        stats[c.commiter].inserted += c.inserted
        stats[c.commiter].deleted += c.deleted
        stats[c.commiter].commits += 1

    return stats

def statsPerAuthor(commits):
    stats = {}

    for c in filter(lambda c: type(c) is RegularCommit, commits):
        for a in c.authors:
            if a not in stats:
                stats[a] = StatAuthor()

            stats[a].inserted += c.inserted
            stats[a].deleted += c.deleted
            stats[a].commits += 1

    return stats








###### MAIN  ######

parser = argparse.ArgumentParser()

parser.add_argument("--begin", nargs = 3, type = int,
                    metavar=("ANNEE","MOIS","JOUR"),
                    help = "Date de début de la période à couvrir")
parser.add_argument("--end", nargs = 3, type = int,
                    metavar=("ANNEE","MOIS","JOUR"),
                    help="Date de fin de la période à couvrir")
parser.add_argument("--authors", nargs = "*", metavar="AUTEUR",
                    help = "Les initiales des auteurs pour lesquels on veut extraire les statistiques")
parser.add_argument("--tasks", nargs = "*", metavar = "TACHE",
                    help = "La liste des tâches pour lesquelles on veut extraire les statistiques. Les"
                           "valeurs possibles sont les suivantes: {} {} {} {} {} {}".format(DEV,DEBUG,REFACTOR,TEST,OTHER,NONE))
parser.add_argument("--sprint", type = int,
                    help = "Les stats ne seront fournies que pour le sprint spécifié")


args = parser.parse_args()



commits = parseStats(getStatFile())

print("Commit;Date;Author;Task;Files;Inserted;Deleted")
for c in commits:
    if type(c) is RegularCommit:
        print("{};{};{};{};{};{};{}".format(c.id[:6], c.date, c.commiter, c.task, c.files, c.inserted, c.deleted))
    else:
        print("{};{};{};MERGE;-;-;-".format(c.id[:6], c.date, c.commiter))


print("Number of commits:",  len(commits))
for (commiter,stats) in statsPerCommiter(commits).items():
    print("Commiter {:40} {:4} commits - ins.: {:6}  del.: {:6}   av. ins.: {:6.2f}, av. del: {:6.2f}".format(commiter,
                                                                                    stats.commits,
                                                                                    stats.inserted,
                                                                                    stats.deleted,
                                                                                    stats.inserted/stats.commits,
                                                                                    stats.deleted/stats.commits))

print()
for (author, stats) in statsPerAuthor(commits).items():
    print("Author {:5} {:4} commits  - ins.: {:6}  del.: {:6}   av. ins.: {:6.2f}, av. del: {:6.2f}".format(author,
                                                                                    stats.commits,
                                                                                    stats.inserted,
                                                                                    stats.deleted,
                                                                                    stats.inserted / stats.commits,
                                                                                    stats.deleted / stats.commits))
