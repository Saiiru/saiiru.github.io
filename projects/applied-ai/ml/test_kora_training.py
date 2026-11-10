import unittest
import train

class KoraTrainingTests(unittest.TestCase):
    def test_trainer_accepts_domain_labels_without_fitting_test_vocabulary(self):
        classes=['finance','events','knowledge']
        rows=[]
        for label in classes:
            for split in ['train','validation','test']:
                rows.append(dict(id=f'{label}-{split}',group=f'{label}-{split}',split=split,label=label,text=f'{label} {split}'))
        artifact,report,pipe=train.train_model(rows,classes=classes,name='KORA Rota',baseline=lambda text:text.split()[0])
        self.assertEqual(artifact['classes'],sorted(classes))
        self.assertNotIn('test',artifact['vocabulary'])
        self.assertEqual(report['test']['support'],3)
        self.assertEqual(artifact['name'],'KORA Rota')

if __name__=='__main__': unittest.main()
