import unittest
from extractStats import *

config = {
    # The codes used in the commits to indicate the task
    'task_code':{
        'dev': ["(D)","[D]","D"],
        'debug': ["(B)","[B]","B"],
        'test': ["(T)","[T]","T"],
        'refactor': ["(R)","[R]","R"],
        'other': ["(A)","[A]","A"]
    },

    # Only commits within this period of time will be displayed
    # If 'begin' key is absent, no inferior time limit will be taken
    # If 'end' key is absent, no superior time limit will be taken
    'period':{
        'begin': date(2019,2,1),
        'end': date.today()
    },

    # Only commits from these authors will be displayed
    # If this key is removed, all authors will be displayed
    #'authors':[
    #    '<michel.gagnon@polymtl.ca>',
    #    '<dylan.farvacque@polymtl.ca>'
    #],

    # Only commits for these tasks will be displayed
    # If this key is removed, alls tasks will be displayed
    'tasks': [DEV,DEBUG],

    # Put 'true' if you want to display merge commits
    'merge': False

}



class test(unittest.TestCase):
    def setUp(self):
        self.stats = open("./__OUT_TEST_100__")
    def test1(self):
        commits = parseStats(self.stats)
        self.assertTrue(len(commits) == 36)
        c = commits[0]
        self.assertEqual("{};{};{};{};{};{};{}".format(c.id[:6], c.date, c.commiter, c.task, c.files, c.inserted, c.deleted),
                         "2bba4c;2019-02-03;<alexandre.h.falardeau@gmail.com>;DEV;4;18;17",
                         "Check first commit")

        c = commits[1]
        self.assertEqual("{};{};{};{};{};{};{}".format(c.id[:6], c.date, c.commiter, c.task, c.files, c.inserted, c.deleted),
                         "69b28f;2019-02-03;<loicleblancprofessionnel@gmail.com>;DEBUG;2;6;5",
                         "Check second commit")

        c = commits[4]
        self.assertEqual("{};{};{};{};{};{};{}".format(c.id[:6], c.date, c.commiter, c.task, c.files, c.inserted, c.deleted),
                         "f7aa41;2019-02-03;<camille.bourbonnais@gmail.com>;DEV;4;25;8",
                         "Check fift commit")

        c = commits[35]
        self.assertEqual("{};{};{};{};{};{};{}".format(c.id[:6], c.date, c.commiter, c.task, c.files, c.inserted, c.deleted),
                         "8da873;2019-02-01;<alexandre.h.falardeau@gmail.com>;DEV;4;121;0",
                         "Check fift commit")


        c = commits[29]
        self.assertEqual("{};{};{};{};{};{};{}".format(c.id[:6], c.date, c.commiter, c.task, c.files, c.inserted, c.deleted),
                         "1c3fa3;2019-02-01;<loicleblancprofessionnel@gmail.com>;DEBUG;2;42;19",
                         "Check fift commit")



